import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/logo"
import { SiteFooter } from "@/components/site-footer"

export function PageShell({
  title,
  intro,
  children,
}: {
  title: string
  intro?: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Cabeçalho simples */}
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

      {/* Título */}
      <div className="bg-brand-navy-deep text-white">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-balance font-heading text-2xl font-bold sm:text-3xl">{title}</h1>
          {intro ? <p className="mt-3 text-pretty text-sm leading-relaxed text-white/75">{intro}</p> : null}
        </div>
      </div>

      {/* Conteúdo */}
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="space-y-8 leading-relaxed text-foreground/90">{children}</div>

        <div className="mt-12 rounded-2xl border border-border bg-secondary/50 p-6 text-center">
          <p className="text-sm text-muted-foreground">Precisa de ajuda? Fale com o nosso atendimento.</p>
          <a
            href="mailto:contato@suporteonlinebr.com"
            className="mt-3 inline-flex items-center justify-center rounded-xl bg-brand-navy px-6 py-3 font-heading text-sm font-bold text-white transition hover:brightness-110"
          >
            contato@suporteonlinebr.com
          </a>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-heading text-lg font-bold text-foreground">{heading}</h2>
      <div className="mt-2 space-y-2 text-sm text-foreground/80">{children}</div>
    </section>
  )
}
