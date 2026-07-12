// Helpers de formatação, frete e cupom para a página de checkout.

export type ShippingId = "pac" | "sedex" | "full"

export type ShippingOption = {
  id: ShippingId
  name: string
  eta: string
  price: number
  tag?: string
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: "pac", name: "PAC", eta: "3 a 7 dias", price: 0, tag: "Correios" },
  { id: "sedex", name: "SEDEX", eta: "1 a 3 dias", price: 9.81, tag: "SEDEX" },
  { id: "full", name: "Envio FULL", eta: "Entrega garantida", price: 17.9, tag: "FULL" },
]

export function getShipping(id: ShippingId): ShippingOption {
  return SHIPPING_OPTIONS.find((s) => s.id === id) ?? SHIPPING_OPTIONS[0]
}

// Cupons de demonstração. Percentual aplicado sobre o subtotal.
const COUPONS: Record<string, number> = {
  AQUALUX10: 0.1,
  BEMVINDO5: 0.05,
}

export function getCoupon(code: string): { code: string; percent: number } | null {
  const key = code.trim().toUpperCase()
  if (!key) return null
  const percent = COUPONS[key]
  if (!percent) return null
  return { code: key, percent }
}

// ----- Máscaras -----
export function onlyDigits(v: string): string {
  return v.replace(/\D/g, "")
}

export function maskCPF(v: string): string {
  return onlyDigits(v)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}

export function maskPhone(v: string): string {
  const d = onlyDigits(v).slice(0, 11)
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2")
  }
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2")
}

export function maskCEP(v: string): string {
  return onlyDigits(v)
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2")
}

export function maskCard(v: string): string {
  return onlyDigits(v)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim()
}

export function maskExpiry(v: string): string {
  return onlyDigits(v)
    .slice(0, 4)
    .replace(/(\d{2})(\d{1,2})$/, "$1/$2")
}

export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}
