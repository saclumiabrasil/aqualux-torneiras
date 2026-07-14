import "server-only"

/**
 * Adapter central do PagouAI.
 *
 * Toda a comunicação com o gateway passa por aqui, para que o restante do app
 * não dependa do formato exato da API. Os campos foram baseados na referência
 * pública do PagouAI (POST /v2/transactions, auth Bearer, valores em centavos).
 * Se algum nome de campo divergir da sua conta, ajuste apenas este arquivo.
 */

const PAGOU_ENV = process.env.PAGOU_ENV ?? "sandbox"
const BASE_URL =
  PAGOU_ENV === "production" ? "https://api.pagou.ai" : "https://api.sandbox.pagou.ai"

const SECRET_KEY = process.env.PAGOU_SECRET_KEY

export interface PagouBuyer {
  name: string
  email: string
  phone?: string
  document?: { type: "CPF" | "CNPJ"; number: string }
}

export interface PagouProduct {
  name: string
  price: number // centavos
  quantity: number
}

export interface CreateTransactionInput {
  externalRef: string
  amountCents: number
  method: "pix" | "credit_card"
  buyer: PagouBuyer
  products: PagouProduct[]
  cardToken?: string
  installments?: number
  postbackUrl?: string
}

export interface NormalizedTransaction {
  id: string
  status: "pending" | "paid" | "failed" | "canceled" | "refunded"
  pixQrCode: string | null // copia-e-cola
  pixQrCodeBase64: string | null // imagem base64
  pixExpiresAt: string | null
  raw: unknown
}

function assertConfigured() {
  if (!SECRET_KEY) {
    throw new Error("PAGOU_SECRET_KEY não configurada no ambiente.")
  }
}

function pick<T = string>(obj: any, paths: string[]): T | null {
  for (const path of paths) {
    const value = path.split(".").reduce((acc: any, key) => (acc == null ? acc : acc[key]), obj)
    if (value !== undefined && value !== null && value !== "") return value as T
  }
  return null
}

const PAID = ["paid", "approved", "succeeded", "confirmed", "completed"]
const FAILED = ["failed", "declined", "error", "denied", "rejected"]
const CANCELED = ["canceled", "cancelled", "expired", "voided"]
const REFUNDED = ["refunded", "chargeback"]

export function normalizeStatus(raw?: string | null): NormalizedTransaction["status"] {
  const s = (raw ?? "").toString().toLowerCase()
  if (PAID.includes(s)) return "paid"
  if (FAILED.includes(s)) return "failed"
  if (CANCELED.includes(s)) return "canceled"
  if (REFUNDED.includes(s)) return "refunded"
  return "pending"
}

function normalizeTransaction(payload: any): NormalizedTransaction {
  // A resposta pode vir dentro de { data: {...} } ou { transaction: {...} }.
  const data = payload?.data ?? payload?.transaction ?? payload

  const id = pick<string>(data, ["id", "transaction_id", "uuid", "reference"]) ?? ""
  const status = normalizeStatus(pick<string>(data, ["status", "payment_status", "state"]))

  const pixQrCode = pick<string>(data, [
    "pix_code",
    "pix.pix_code",
    "pix.copy_paste",
    "pix.qr_code_text",
    "pix.emv",
    "qr_code_text",
    "copy_paste",
  ])

  const pixQrCodeBase64 = pick<string>(data, [
    "pix.qr_code",
    "pix.qr_code_base64",
    "pix.qr_code_image",
    "qr_code_base64",
    "qr_code",
  ])

  const pixExpiresAt = pick<string>(data, ["pix.expires_at", "expires_at", "pix.expiration"])

  return { id, status, pixQrCode, pixQrCodeBase64, pixExpiresAt, raw: payload }
}

async function request(path: string, init: RequestInit): Promise<any> {
  assertConfigured()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${SECRET_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  })

  const text = await res.text()
  let json: any = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = { raw: text }
  }

  if (!res.ok) {
    const message =
      pick<string>(json, ["message", "error", "error.message", "errors.0.message"]) ??
      `Falha na requisição ao PagouAI (HTTP ${res.status}).`
    const err = new Error(message) as Error & { status?: number; body?: unknown }
    err.status = res.status
    err.body = json
    throw err
  }

  return json
}

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<NormalizedTransaction> {
  const body: Record<string, unknown> = {
    external_ref: input.externalRef,
    amount: input.amountCents,
    method: input.method,
    buyer: {
      name: input.buyer.name,
      email: input.buyer.email,
      ...(input.buyer.phone ? { phone: input.buyer.phone } : {}),
      ...(input.buyer.document ? { document: input.buyer.document } : {}),
    },
    products: input.products,
    ...(input.postbackUrl ? { postback_url: input.postbackUrl } : {}),
  }

  if (input.method === "credit_card") {
    body.token = input.cardToken
    body.installments = input.installments ?? 1
  }

  const json = await request("/v2/transactions", {
    method: "POST",
    body: JSON.stringify(body),
  })

  return normalizeTransaction(json)
}

export async function getTransaction(id: string): Promise<NormalizedTransaction> {
  const json = await request(`/v2/transactions/${id}`, { method: "GET" })
  return normalizeTransaction(json)
}

/** Extrai o id da transação de um payload de webhook do PagouAI. */
export function extractWebhookTransactionId(payload: any): string | null {
  const data = payload?.data ?? payload?.transaction ?? payload
  return pick<string>(data, ["id", "transaction_id", "uuid", "reference", "external_ref"])
}

export function getPagouEnv() {
  return PAGOU_ENV
}
