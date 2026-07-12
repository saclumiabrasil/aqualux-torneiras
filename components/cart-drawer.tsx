"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, X, Minus, Plus, Trash2, ShieldCheck, Truck } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { formatBRL } from "@/lib/checkout"
import { cn } from "@/lib/utils"

export function CartDrawer() {
  const { isOpen, closeCart, lines, count, subtotal, discount, setQty, removeItem } = useCart()

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] transition-opacity duration-300",
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!isOpen}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-brand-navy-deep/70 backdrop-blur-sm" onClick={closeCart} />

      {/* Painel */}
      <aside
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Seu carrinho"
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-brand-navy">
            <ShoppingBag className="size-5" />
            Seu Carrinho
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Fechar carrinho"
            className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {count === 0 ? (
          /* Estado vazio */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="size-16 text-muted-foreground/40" strokeWidth={1.5} />
            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
            <button
              type="button"
              onClick={closeCart}
              className="rounded-xl bg-brand-navy px-6 py-3 font-heading text-sm font-bold text-white transition hover:brightness-110"
            >
              Continuar comprando
            </button>
          </div>
        ) : (
          <>
            {/* Itens */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {lines.map((line) => (
                  <li key={line.kitId} className="flex gap-3 rounded-2xl border border-border p-3">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-white">
                      <Image
                        src={line.kit.img || "/placeholder.svg"}
                        alt={line.kit.units}
                        fill
                        sizes="80px"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold leading-tight text-foreground">AquaLux Digital</p>
                          <p className="text-xs text-muted-foreground">{line.kit.units}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(line.kitId)}
                          aria-label="Remover item"
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        {/* Stepper */}
                        <div className="flex items-center rounded-lg border border-border">
                          <button
                            type="button"
                            onClick={() => setQty(line.kitId, line.qty - 1)}
                            aria-label="Diminuir quantidade"
                            className="inline-flex size-8 items-center justify-center text-brand-navy transition-colors hover:bg-secondary"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold tabular-nums">{line.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(line.kitId, line.qty + 1)}
                            aria-label="Aumentar quantidade"
                            className="inline-flex size-8 items-center justify-center text-brand-navy transition-colors hover:bg-secondary"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <p className="font-heading text-sm font-bold text-brand-navy">
                          R$ {formatBRL(line.lineTotal)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rodapé */}
            <div className="border-t border-border px-5 py-4">
              {discount > 0 && (
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Desconto</span>
                  <span className="font-semibold text-emerald-600">- R$ {formatBRL(discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal ({count})</span>
                <span className="font-heading text-xl font-extrabold text-brand-navy">R$ {formatBRL(subtotal)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 flex items-center justify-center rounded-xl bg-brand-navy py-4 font-heading text-base font-bold text-white shadow-lg shadow-brand-navy/20 transition hover:brightness-110"
              >
                Finalizar Compra
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 w-full py-2 text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Continuar comprando
              </button>
              <div className="mt-3 flex items-center justify-center gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-brand-navy" /> Compra segura
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="size-4 text-brand-navy" /> Frete grátis
                </span>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
