"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Zap, ShieldCheck, Clock } from "lucide-react"

function format(n: number) {
  return n.toString().padStart(2, "0")
}

export function OfferCountdown() {
  const [seconds, setSeconds] = useState(2 * 3600 + 7 * 60 + 31)

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  return (
    <section className="bg-background py-8">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-2xl border border-[#e11d2a]/30 bg-card p-6 text-center shadow-sm">
          <p className="flex items-center justify-center gap-2 font-heading font-bold text-[#e11d2a]">
            <AlertTriangle className="size-5" />
            Oferta termina em: {format(h)}:{format(m)}:{format(s)}
          </p>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-foreground">
            <Zap className="size-4 text-accent" />
            Estoque limitado — depois volta a <span className="font-semibold">R$ 199,90</span>
          </p>
          <a
            href="#escolha-kit"
            className="mt-4 flex items-center justify-center rounded-xl bg-brand-navy py-4 font-heading text-base font-bold text-white shadow-lg shadow-brand-navy/20 transition hover:brightness-110"
          >
            QUERO COM DESCONTO
          </a>
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-brand-navy" /> Compra segura
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-brand-navy" /> Garantia 30 dias
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
