"use client"

import { useEffect, useState } from "react"
import {
  Menu,
  X,
  Search,
  Truck,
  Home,
  ChevronRight,
  ShoppingBag,
  Zap,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

const mainLinks = [
  { label: "Início", href: "#inicio", icon: Home },
  { label: "Rastrear Pedido", href: "#rastreio", icon: Truck },
]

const policyLinks = [
  { label: "Política de Frete", href: "#frete" },
  { label: "Pagamento Seguro", href: "#pagamento" },
  { label: "Termos de Uso", href: "#termos" },
  { label: "Trocas e Reembolso", href: "#trocas" },
]

const institutionalLinks = [
  { label: "Quem Somos", href: "#quem-somos" },
  { label: "Dúvidas Frequentes", href: "#faq" },
  { label: "Política de Privacidade", href: "#privacidade" },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <>
      {/* Barra de anúncio */}
      <div className="bg-brand-navy-deep text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-semibold tracking-wide sm:text-sm">
          <Zap className="size-4 shrink-0 fill-brand-sky text-brand-sky" />
          <span className="text-pretty">Frete Grátis + Envio Imediato</span>
        </div>
      </div>

      {/* Cabeçalho principal */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="-ml-1 inline-flex size-10 items-center justify-center rounded-md text-primary transition-colors hover:bg-secondary"
            aria-label="Abrir menu"
          >
            <Menu className="size-6" />
          </button>

          <a href="#inicio" aria-label="AquaLux - página inicial">
            <Logo />
          </a>

          <div className="flex items-center gap-1">
            <a
              href="#rastreio"
              className="inline-flex size-10 items-center justify-center rounded-md text-primary transition-colors hover:bg-secondary"
              aria-label="Rastrear pedido"
            >
              <Truck className="size-5" />
            </a>
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="inline-flex size-10 items-center justify-center rounded-md text-primary transition-colors hover:bg-secondary"
              aria-label="Buscar produtos"
            >
              <Search className="size-5" />
            </button>
          </div>
        </div>

        {/* Barra de busca expansível */}
        {searchOpen && (
          <div className="border-t border-border bg-background">
            <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
              <Search className="size-5 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                type="search"
                placeholder="O que você procura hoje?"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Fechar busca"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Menu lateral (drawer) */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-300",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!menuOpen}
      >
        <div
          className="absolute inset-0 bg-brand-navy-deep/70 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        <nav
          className={cn(
            "absolute left-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-background shadow-2xl transition-transform duration-300",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
          aria-label="Menu principal"
        >
          {/* Cabeçalho do menu */}
          <div className="relative bg-gradient-to-b from-brand-navy-deep to-brand-navy px-6 pb-7 pt-6 text-center text-white">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Fechar menu"
            >
              <X className="size-5" />
            </button>
            <div className="flex justify-center">
              <Logo variant="light" className="text-2xl" />
            </div>
            <p className="mt-2 text-sm text-white/70">Bem-vindo(a) à AquaLux</p>
          </div>

          {/* Corpo do menu */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {mainLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-primary transition-colors hover:bg-secondary"
                  >
                    <span className="inline-flex size-9 items-center justify-center rounded-full bg-secondary text-accent">
                      <Icon className="size-5" />
                    </span>
                    <span className="flex-1 font-medium">{label}</span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>

            <MenuSection title="Políticas" links={policyLinks} onNavigate={() => setMenuOpen(false)} />
            <MenuSection title="Institucional" links={institutionalLinks} onNavigate={() => setMenuOpen(false)} />
          </div>

          {/* Rodapé do menu */}
          <div className="border-t border-border px-6 py-4">
            <a
              href="#comprar"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-accent py-3 font-semibold text-accent-foreground transition-colors hover:brightness-95"
            >
              <ShoppingBag className="size-5" />
              Comprar Agora
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}

function MenuSection({
  title,
  links,
  onNavigate,
}: {
  title: string
  links: { label: string; href: string }[]
  onNavigate: () => void
}) {
  return (
    <div className="mt-6">
      <h3 className="px-3 pb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      <ul>
        {links.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              onClick={onNavigate}
              className="flex items-center justify-between rounded-lg px-3 py-3 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            >
              {label}
              <ChevronRight className="size-4 text-muted-foreground/60" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
