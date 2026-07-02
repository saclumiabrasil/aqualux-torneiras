"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Package, Search, Truck, CheckCircle2, MapPin } from "lucide-react"
import { Logo } from "@/components/logo"
import { SiteFooter } from "@/components/site-footer"

const steps = [
  { icon: CheckCircle2, label: "Pedido confirmado", desc: "Pagamento aprovado com sucesso." },
  { icon: Package, label: "Em separação", desc: "Seu pedido está sendo preparado no centro de distribuição." },
  { icon: Truck, label: "A caminho", desc: "Objeto postado e em rota de entrega." },
  { icon: MapPin, label: "Saiu para entrega", desc: "O produto chegará em breve ao seu endereço." },
]

export default function Page() {
  const [code, setCode] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim().length === 0) return
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-brand-navy"
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
          <Link href="/" aria-label="AquaLux - página inicial">
            <Logo />
          </Link>
        </div>
      </header>

      <div className="bg-brand-navy-deep text-white">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-balance font-heading text-2xl font-bold sm:text-3xl">Rastrear Pedido</h1>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-white/75">
            Informe o código de rastreio ou o número do pedido enviado para o seu e-mail e acompanhe cada etapa da
            entrega.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <label htmlFor="tracking" className="text-sm font-semibold text-foreground">
            Código de rastreio ou nº do pedido
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3">
              <Search className="size-5 shrink-0 text-muted-foreground" />
              <input
                id="tracking"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex.: BR123456789BR ou #AQL-10245"
                className="w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center rounded-xl bg-brand-navy px-6 py-3 font-heading text-sm font-bold text-white transition hover:brightness-110"
            >
              Rastrear
            </button>
          </div>
        </form>

        {submitted ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Acompanhamento do pedido <span className="font-semibold text-foreground">{code}</span>
            </p>
            <ol className="mt-6 space-y-6">
              {steps.map((s, i) => {
                const active = i <= 2
                return (
                  <li key={s.label} className="flex gap-4">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                        active ? "bg-brand-navy text-white" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <s.icon className="size-5" />
                    </div>
                    <div className="pt-1">
                      <p className={`font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>
                        {s.label}
                      </p>
                      <p className="text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
            <p className="mt-6 rounded-xl bg-secondary/60 p-4 text-xs leading-relaxed text-muted-foreground">
              As informações de rastreio podem levar até 24h para serem atualizadas pela transportadora após a
              postagem. Em caso de dúvidas, fale com o nosso atendimento.
            </p>
          </div>
        ) : (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Digite o código acima para visualizar o status da sua entrega.
          </p>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
