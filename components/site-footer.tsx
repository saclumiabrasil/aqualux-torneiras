import Link from "next/link"
import { Logo } from "@/components/logo"
import { PaymentMethods } from "@/components/payment-methods"
import { Mail, Phone, Clock, Truck } from "lucide-react"

const columns = [
  {
    title: "Políticas",
    links: [
      { label: "Política de Frete", href: "/politica-de-frete" },
      { label: "Pagamento Seguro", href: "/pagamento-seguro" },
      { label: "Termos de Uso", href: "/termos-de-uso" },
      { label: "Trocas e Reembolso", href: "/trocas-e-reembolso" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { label: "Quem Somos", href: "/quem-somos" },
      { label: "Dúvidas Frequentes", href: "/duvidas-frequentes" },
      { label: "Política de Privacidade", href: "/politica-de-privacidade" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-brand-navy-deep text-primary-foreground">
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Atendimento */}
        <h3 className="font-heading text-lg font-bold uppercase tracking-wide">Atendimento ao Cliente</h3>
        <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
          <li className="flex items-center gap-2.5">
            <Mail className="size-4 text-primary-foreground/60" />
            contato@suporteonlinebr.com
          </li>
          <li className="flex items-center gap-2.5">
            <Phone className="size-4 text-primary-foreground/60" />
            (27) 99988-7436
          </li>
          <li className="flex items-center gap-2.5">
            <Clock className="size-4 text-primary-foreground/60" />
            Seg-Sex: 08h às 17h
          </li>
        </ul>

        <Link
          href="/rastrear-pedido"
          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3.5 text-sm font-medium transition-colors hover:bg-white/15"
        >
          <Truck className="size-4" /> Rastrear Pedido
        </Link>

        {/* Colunas de links */}
        <div className="mt-10 grid grid-cols-2 gap-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-heading text-sm font-bold uppercase tracking-wide">{col.title}</h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Aviso */}
        <p className="mt-10 border-t border-white/10 pt-8 text-center text-xs leading-relaxed text-primary-foreground/60">
          Preços e condições exclusivos para compras neste site oficial, podendo variar com o tempo da oferta. Evite
          comprar produtos mais baratos ou de outras lojas, pois você pode estar sendo enganado(a) por um golpista.
        </p>

        {/* Formas de pagamento */}
        <div className="mt-8 text-center">
          <p className="text-sm font-semibold">Nós aceitamos</p>
          <div className="mt-4">
            <PaymentMethods />
          </div>
        </div>

        {/* Logo e endereço */}
        <div className="mt-10 border-t border-white/10 pt-8 text-center">
          <div className="flex justify-center">
            <Logo className="text-primary-foreground" />
          </div>
          <p className="mt-4 font-heading text-sm font-bold">AquaLux Ltda</p>
          <p className="mt-1 text-xs leading-relaxed text-primary-foreground/60">
            Rua Henry Ford, nº 548
            <br />
            Osasco — São Paulo/SP, CEP 06210-100
          </p>
          <p className="mt-4 text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} AquaLux. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
