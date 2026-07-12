// Links de checkout dos produtos (página de vendas).
// Cada kit aponta para o link de compra correspondente.
const CHECKOUT_BASE = "https://seguro.aqualuxtorneiras.site"

export type KitId = "1un" | "2un" | "3un"

const PRODUCT_IDS: Record<KitId, string> = {
  "1un": "3394124211431",
  "2un": "3394139274438",
  "3un": "3394182432433",
}

export type Kit = {
  id: KitId
  units: string
  subtitle: string
  old: string
  oldValue: number
  price: string
  priceValue: number
  off: string
  img: string
  bestSeller?: boolean
}

// Catálogo de kits compartilhado entre o seletor (ProductHero),
// o bloco de preço e a barra fixa (StickyBuyBar).
export const KITS: Kit[] = [
  {
    id: "1un",
    units: "1 unidade",
    subtitle: "Para uso individual",
    old: "R$ 199,90",
    oldValue: 199.9,
    price: "R$ 97,14",
    priceValue: 97.14,
    off: "51%",
    img: "/images/kit-1.png",
  },
  {
    id: "2un",
    units: "2 unidades",
    subtitle: "Ideal para casa toda",
    old: "R$ 399,80",
    oldValue: 399.8,
    price: "R$ 149,21",
    priceValue: 149.21,
    off: "63%",
    img: "/images/kit-2.png",
    bestSeller: true,
  },
  {
    id: "3un",
    units: "3 unidades",
    subtitle: "Melhor custo-benefício",
    old: "R$ 599,70",
    oldValue: 599.7,
    price: "R$ 195,90",
    priceValue: 195.9,
    off: "67%",
    img: "/images/kit-3.png",
  },
]

export function getKit(kit: KitId): Kit {
  return KITS.find((k) => k.id === kit) ?? KITS[1]
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const STORE_ID = "33941"

export function getCheckoutUrl(kit: KitId): string {
  const product = PRODUCT_IDS[kit]
  return `${CHECKOUT_BASE}/api/public/shopify?product=${product}&store=${STORE_ID}`
}

// Kit padrão usado pelos CTAs fora do seletor (barra fixa, oferta, etc.)
export const DEFAULT_KIT: KitId = "2un"

// Abre o checkout do kit informado. No preview do v0 (dentro de um iframe)
// abre em nova aba; fora do iframe navega na própria janela.
export function openCheckout(kit: KitId) {
  if (typeof window === "undefined") return
  const url = getCheckoutUrl(kit)
  if (window.self !== window.top) {
    window.open(url, "_blank", "noopener,noreferrer")
  } else {
    window.location.href = url
  }
}
