import { Star, BadgeCheck, Flame, ShieldCheck, Truck } from "lucide-react"
import { ReviewPhotosCarousel } from "@/components/review-photos-carousel"

const reviews = [
  {
    name: "Marcos A.",
    city: "São Paulo/SP",
    initial: "M",
    text: "Instalei em menos de 5 minutos, sem ferramentas. A água sai quente quase imediato e o display digital é muito útil.",
  },
  {
    name: "Fernanda C.",
    city: "Belo Horizonte/MG",
    initial: "F",
    text: "Resolveu o problema da minha cozinha que não tinha água quente. Lavar louça ficou muito melhor no inverno.",
  },
  {
    name: "Ricardo M.",
    city: "Curitiba/PR",
    initial: "R",
    text: "Veio tudo direitinho, com os adaptadores. Encaixou perfeito na minha torneira e a temperatura sobe rapidinho.",
  },
  {
    name: "André P.",
    city: "Porto Alegre/RS",
    initial: "A",
    text: "Aquecimento muito rápido, temperatura constante, design moderno. Economia de energia comparado ao boiler antigo.",
  },
  {
    name: "Juliana S.",
    city: "Goiânia/GO",
    initial: "J",
    text: "Nota 1000! Display mostra a temperatura certinha, a barra LED muda de cor, e instalei sozinha sem ajuda. Recomendo demais!",
  },
]

export function Reviews() {
  return (
    <section id="avaliacoes" className="scroll-mt-24 bg-secondary/40 py-12">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <p className="flex items-center justify-center gap-1.5 text-sm font-bold uppercase tracking-wide text-[#e11d2a]">
            <Flame className="size-4" /> Mais de 3 mil clientes satisfeitos
          </p>
          <h2 className="mt-2 text-balance font-heading text-2xl font-bold text-foreground">
            Veja o que nossos clientes estão falando
          </h2>
          <p className="mt-2 flex items-center justify-center gap-2 text-sm">
            <span className="flex text-[#f5a623]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </span>
            <span className="font-semibold text-foreground">4.9</span>
            <span className="text-muted-foreground">— 3.127 avaliações verificadas</span>
          </p>
        </div>

        {/* Fotos em carrossel automático */}
        <ReviewPhotosCarousel />

        {/* Avaliações */}
        <div className="mt-6 space-y-3">
          {reviews.map((r) => (
            <div key={r.name} className="rounded-2xl bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-sm font-bold text-brand-navy">
                  {r.initial}
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                    {r.name}
                    <span className="flex items-center gap-1 text-xs font-medium text-brand-navy">
                      <BadgeCheck className="size-3.5" /> Verificado
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{r.city}</p>
                </div>
              </div>
              <div className="mt-2 flex text-[#f5a623]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">{r.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <a
            href="#comprar"
            className="inline-flex items-center gap-1 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-foreground transition hover:bg-secondary/70"
          >
            Ver todas as 3.127 avaliações →
          </a>
        </div>

        {/* Selos */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          <SmallBadge icon={ShieldCheck} title="Compra 100% segura" />
          <SmallBadge icon={Star} title="4.9 de avaliação" />
          <SmallBadge icon={Truck} title="Entrega rápida" />
        </div>

        {/* CTA */}
        <a
          href="#comprar"
          className="mt-6 flex items-center justify-center rounded-xl bg-brand-navy py-4 font-heading text-lg font-bold text-white shadow-lg shadow-brand-navy/20 transition hover:brightness-110"
        >
          APROVEITAR OFERTA
        </a>
      </div>
    </section>
  )
}

function SmallBadge({ icon: Icon, title }: { icon: typeof Star; title: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl bg-card p-4 text-center shadow-sm">
      <Icon className="size-5 text-brand-navy" />
      <span className="text-xs font-medium text-foreground">{title}</span>
    </div>
  )
}
