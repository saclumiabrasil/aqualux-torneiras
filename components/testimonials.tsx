import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Marina Alves",
    location: "São Paulo, SP",
    text: "A garrafa térmica manteve minha água gelada o dia inteiro no trabalho. Qualidade impecável e chegou super rápido!",
  },
  {
    name: "Rafael Souza",
    location: "Belo Horizonte, MG",
    text: "Comprei a motivacional de 2L e finalmente consegui bater minha meta de hidratação. Recomendo demais!",
  },
  {
    name: "Camila Ferreira",
    location: "Curitiba, PR",
    text: "Design lindo, material resistente e o atendimento foi excelente. Já é minha terceira compra na AquaLux.",
  },
]

export function Testimonials() {
  return (
    <section className="bg-secondary/40 py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-accent">Depoimentos</span>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Quem usa, recomenda
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <Quote className="size-8 text-accent/30" />
              <blockquote className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-foreground/80">
                {t.text}
              </blockquote>
              <div className="mt-4 flex text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <figcaption className="mt-3 border-t border-border pt-3">
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.location}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
