import { type NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { calculateOrder, type CartItemInput } from "@/lib/pricing"
import { createOrder, setOrderTransaction, type ShippingAddress } from "@/lib/db"
import { createTransaction } from "@/lib/pagou"
import { onlyDigits, isValidEmail } from "@/lib/checkout-helpers"

interface CreateBody {
  items: CartItemInput[]
  couponCode?: string
  shippingId: "pac" | "sedex" | "full"
  paymentMethod: "pix" | "credit_card"
  cardToken?: string
  installments?: number
  customer: {
    name: string
    email: string
    cpf: string
    phone: string
  }
  shipping: ShippingAddress
}

export async function POST(req: NextRequest) {
  let body: CreateBody
  try {
    body = (await req.json()) as CreateBody
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 })
  }

  // Validação básica
  const { customer, items, paymentMethod, shippingId } = body
  if (!items?.length) {
    return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 })
  }
  if (!customer?.name || customer.name.trim().length < 3) {
    return NextResponse.json({ error: "Nome inválido." }, { status: 400 })
  }
  if (!isValidEmail(customer?.email ?? "")) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 })
  }
  if (onlyDigits(customer?.cpf ?? "").length !== 11) {
    return NextResponse.json({ error: "CPF inválido." }, { status: 400 })
  }
  if (paymentMethod === "credit_card" && !body.cardToken) {
    return NextResponse.json({ error: "Token do cartão ausente." }, { status: 400 })
  }

  // Recalcula os valores no servidor (nunca confia no cliente)
  const pricing = calculateOrder({
    items,
    couponCode: body.couponCode,
    shippingId,
    paymentMethod,
  })

  if (pricing.totalCents <= 0) {
    return NextResponse.json({ error: "Total inválido." }, { status: 400 })
  }

  const orderId = randomUUID()

  // 1) Cria o pedido como pendente
  await createOrder({
    id: orderId,
    status: "pending",
    paymentMethod,
    amountCents: pricing.totalCents,
    customerName: customer.name.trim(),
    customerEmail: customer.email.trim(),
    customerPhone: onlyDigits(customer.phone),
    customerDocument: onlyDigits(customer.cpf),
    shippingAddress: body.shipping,
    items: pricing.items,
    metadata: {
      couponCode: body.couponCode ?? null,
      shippingId,
      subtotalCents: pricing.subtotalCents,
      couponDiscountCents: pricing.couponDiscountCents,
      pixDiscountCents: pricing.pixDiscountCents,
      shippingCents: pricing.shippingCents,
    },
  })

  // 2) Cria a transação no PagouAI
  try {
    const origin = req.nextUrl.origin
    const tx = await createTransaction({
      externalRef: orderId,
      amountCents: pricing.totalCents,
      method: paymentMethod,
      cardToken: body.cardToken,
      installments: body.installments,
      postbackUrl: `${origin}/api/webhooks/pagou`,
      buyer: {
        name: customer.name.trim(),
        email: customer.email.trim(),
        phone: onlyDigits(customer.phone),
        document: { type: "CPF", number: onlyDigits(customer.cpf) },
      },
      products: pricing.items.map((i) => ({
        name: `${i.title} - ${i.units}`,
        price: i.unitPriceCents,
        quantity: i.qty,
      })),
    })

    // 3) Salva os dados da transação no pedido
    await setOrderTransaction(orderId, {
      transactionId: tx.id,
      pixQrCode: tx.pixQrCode,
      pixQrCodeBase64: tx.pixQrCodeBase64,
      pixExpiresAt: tx.pixExpiresAt,
    })

    return NextResponse.json({
      orderId,
      transactionId: tx.id,
      status: tx.status,
      totalCents: pricing.totalCents,
      pix:
        paymentMethod === "pix"
          ? {
              qrCode: tx.pixQrCode,
              qrCodeBase64: tx.pixQrCodeBase64,
              expiresAt: tx.pixExpiresAt,
            }
          : null,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao processar pagamento."
    console.log("[v0] PagouAI createTransaction error:", message)
    return NextResponse.json({ error: message, orderId }, { status: 502 })
  }
}
