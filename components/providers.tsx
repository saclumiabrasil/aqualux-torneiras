"use client"

import type { ReactNode } from "react"
import { KitProvider } from "@/components/kit-provider"
import { CartProvider } from "@/components/cart-provider"
import { CartDrawer } from "@/components/cart-drawer"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <KitProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </KitProvider>
  )
}
