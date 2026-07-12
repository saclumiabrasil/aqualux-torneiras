"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { getKit, type Kit, type KitId } from "@/lib/checkout"

export type CartItem = {
  kitId: KitId
  qty: number
}

export type CartLine = CartItem & {
  kit: Kit
  lineTotal: number
  lineOldTotal: number
}

type CartContextValue = {
  items: CartItem[]
  lines: CartLine[]
  count: number
  subtotal: number
  oldSubtotal: number
  discount: number
  hydrated: boolean
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (kitId: KitId, qty?: number) => void
  setQty: (kitId: KitId, qty: number) => void
  removeItem: (kitId: KitId) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = "aqualux-cart"

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Carrega o carrinho salvo (persiste entre a home e o checkout).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[]
        if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && i.kitId))
      }
    } catch {
      // ignora
    }
    setHydrated(true)
  }, [])

  // Salva sempre que muda.
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignora
    }
  }, [items, hydrated])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const addItem = useCallback((kitId: KitId, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.kitId === kitId)
      if (existing) {
        return prev.map((i) => (i.kitId === kitId ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { kitId, qty }]
    })
    setIsOpen(true)
  }, [])

  const setQty = useCallback((kitId: KitId, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.kitId !== kitId)
        : prev.map((i) => (i.kitId === kitId ? { ...i, qty } : i)),
    )
  }, [])

  const removeItem = useCallback((kitId: KitId) => {
    setItems((prev) => prev.filter((i) => i.kitId !== kitId))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLine[] = items.map((i) => {
      const kit = getKit(i.kitId)
      return {
        ...i,
        kit,
        lineTotal: kit.priceValue * i.qty,
        lineOldTotal: kit.oldValue * i.qty,
      }
    })
    const count = lines.reduce((acc, l) => acc + l.qty, 0)
    const subtotal = lines.reduce((acc, l) => acc + l.lineTotal, 0)
    const oldSubtotal = lines.reduce((acc, l) => acc + l.lineOldTotal, 0)
    return {
      items,
      lines,
      count,
      subtotal,
      oldSubtotal,
      discount: oldSubtotal - subtotal,
      hydrated,
      isOpen,
      openCart,
      closeCart,
      addItem,
      setQty,
      removeItem,
      clear,
    }
  }, [items, hydrated, isOpen, openCart, closeCart, addItem, setQty, removeItem, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart deve ser usado dentro de <CartProvider>")
  }
  return ctx
}
