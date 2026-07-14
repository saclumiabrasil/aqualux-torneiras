import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL!)

export type OrderStatus = "pending" | "paid" | "failed" | "canceled" | "refunded"
export type PaymentMethod = "pix" | "credit_card"

export interface OrderItem {
  kitId: string
  title: string
  units: string
  qty: number
  unitPriceCents: number
  lineTotalCents: number
}

export interface ShippingAddress {
  cep?: string
  street?: string
  number?: string
  complement?: string
  district?: string
  city?: string
  state?: string
}

export interface OrderRecord {
  id: string
  pagou_transaction_id: string | null
  status: OrderStatus
  payment_method: PaymentMethod
  amount_cents: number
  currency: string
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  customer_document: string | null
  shipping_address: ShippingAddress | null
  items: OrderItem[]
  pix_qr_code: string | null
  pix_qr_code_base64: string | null
  pix_expires_at: string | null
  metadata: Record<string, unknown> | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

export interface CreateOrderInput {
  id: string
  status: OrderStatus
  paymentMethod: PaymentMethod
  amountCents: number
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  customerDocument?: string
  shippingAddress?: ShippingAddress
  items: OrderItem[]
  metadata?: Record<string, unknown>
}

export async function createOrder(input: CreateOrderInput): Promise<OrderRecord> {
  const rows = (await sql`
    INSERT INTO orders (
      id, status, payment_method, amount_cents,
      customer_name, customer_email, customer_phone, customer_document,
      shipping_address, items, metadata
    ) VALUES (
      ${input.id}, ${input.status}, ${input.paymentMethod}, ${input.amountCents},
      ${input.customerName ?? null}, ${input.customerEmail ?? null},
      ${input.customerPhone ?? null}, ${input.customerDocument ?? null},
      ${input.shippingAddress ? JSON.stringify(input.shippingAddress) : null},
      ${JSON.stringify(input.items)},
      ${input.metadata ? JSON.stringify(input.metadata) : null}
    )
    RETURNING *
  `) as OrderRecord[]
  return rows[0]
}

export async function setOrderTransaction(
  orderId: string,
  data: {
    transactionId: string
    pixQrCode?: string | null
    pixQrCodeBase64?: string | null
    pixExpiresAt?: string | null
  },
): Promise<void> {
  await sql`
    UPDATE orders SET
      pagou_transaction_id = ${data.transactionId},
      pix_qr_code = ${data.pixQrCode ?? null},
      pix_qr_code_base64 = ${data.pixQrCodeBase64 ?? null},
      pix_expires_at = ${data.pixExpiresAt ?? null},
      updated_at = now()
    WHERE id = ${orderId}
  `
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<void> {
  await sql`
    UPDATE orders SET
      status = ${status},
      paid_at = ${status === "paid" ? new Date().toISOString() : null},
      updated_at = now()
    WHERE id = ${orderId}
  `
}

export async function getOrderById(orderId: string): Promise<OrderRecord | null> {
  const rows = (await sql`SELECT * FROM orders WHERE id = ${orderId} LIMIT 1`) as OrderRecord[]
  return rows[0] ?? null
}

export async function getOrderByTransactionId(
  transactionId: string,
): Promise<OrderRecord | null> {
  const rows = (await sql`
    SELECT * FROM orders WHERE pagou_transaction_id = ${transactionId} LIMIT 1
  `) as OrderRecord[]
  return rows[0] ?? null
}
