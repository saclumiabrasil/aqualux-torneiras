"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useKit } from "@/components/kit-provider"
import { useCart } from "@/components/cart-provider"

export function StickyBuyBar() {
  const [visible, setVisible] = useState(false)
  const { kitId, kit } = useKit()
  const { addItem } = useCart()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const buyNow = () => {
    addItem(kitId)
    router.push("/checkout")
  }

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur transition-transform duration-300 supports-[backdrop-filter]:bg-background/85",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="leading-tight">
          <p className="text-xs text-muted-foreground">
            <span className="line-through">{kit.old}</span>
            <span className="ml-1.5 font-semibold text-foreground">{kit.units}</span>
          </p>
          <p className="font-heading text-xl font-extrabold text-brand-navy">{kit.price}</p>
        </div>
        <button
          type="button"
          onClick={buyNow}
          className="flex flex-1 items-center justify-center rounded-xl bg-brand-navy px-6 py-3.5 font-heading text-base font-bold text-white shadow-lg shadow-brand-navy/20 transition hover:brightness-110 sm:flex-none"
        >
          QUERO O MEU
        </button>
      </div>
    </div>
  )
}
