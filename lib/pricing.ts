import { getKit, type KitId } from "@/lib/checkout"
import { getShipping, getCoupon, type ShippingId } from "@/lib/checkout-helpers"
import type { OrderItem } from "@/lib/db"

export type PaymentMethod = "pix" | "credit_card"

export interface CartItemInput {
  kitId: KitId
  qty: number
}

export interface PricingResult {
  items: OrderItem[]
  subtotalCents: number
  couponDiscountCents: number
  pixDiscountCents: number
  shippingCents: number
  totalCents: number
}

function toCents(value: number): number {
  return Math.round(value * 100)
}

/**
 * Recalcula todos os valores do pedido no servidor a partir dos dados
 * confiáveis (catálogo interno), ignorando qualquer preço vindo do cliente.
 */
export function calculateOrder(params: {
  items: CartItemInput[]
  couponCode?: string
  shippingId: ShippingId
  paymentMethod: PaymentMethod
}): PricingResult {
  const { items, couponCode, shippingId, paymentMethod } = params

  const lines: OrderItem[] = items
    .filter((i) => i && i.qty > 0)
    .map((i) => {
      const kit = getKit(i.kitId)
      const unitPriceCents = toCents(kit.priceValue)
      const qty = Math.max(1, Math.floor(i.qty))
      return {
        kitId: kit.id,
        title: "Aquecedor AquaLux Digital",
        units: kit.units,
        qty,
        unitPriceCents,
        lineTotalCents: unitPriceCents * qty,
      }
    })

  const subtotalCents = lines.reduce((acc, l) => acc + l.lineTotalCents, 0)

  const coupon = couponCode ? getCoupon(couponCode) : null
  const couponDiscountCents = coupon ? Math.round(subtotalCents * coupon.percent) : 0

  const pixDiscountCents = paymentMethod === "pix" ? Math.round(subtotalCents * 0.1) : 0

  const shippingCents = toCents(getShipping(shippingId).price)

  const totalCents = Math.max(
    0,
    subtotalCents - couponDiscountCents - pixDiscountCents + shippingCents,
  )

  return {
    items: lines,
    subtotalCents,
    couponDiscountCents,
    pixDiscountCents,
    shippingCents,
    totalCents,
  }
}
