import { Truck, ShieldCheck, RefreshCcw, CreditCard } from "lucide-react"

const benefits = [
  {
    icon: Truck,
    title: "Frete Grátis",
    description: "Enviamos para todo o Brasil sem custo adicional.",
  },
  {
    icon: ShieldCheck,
    title: "Compra Segura",
    description: "Ambiente 100% protegido e criptografado.",
  },
  {
    icon: RefreshCcw,
    title: "Troca Fácil",
    description: "7 dias para trocas e reembolso garantido.",
  },
  {
    icon: CreditCard,
    title: "Parcele em 12x",
    description: "No cartão ou desconto à vista no Pix.",
  },
]

export function Benefits() {
  return (
    <section className="border-b border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 py-8 md:grid-cols-4">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col items-center gap-2 px-3 text-center md:flex-row md:text-left">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
