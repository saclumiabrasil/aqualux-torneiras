import Image from "next/image"
import { Wrench, Settings, Droplet, Thermometer, Zap } from "lucide-react"

const steps = [
  {
    icon: Wrench,
    title: "1. Desparafuse a saída da torneira",
    desc: "Retire o bico aerador original da sua torneira. Não precisa de ferramentas especiais — só girar com a mão.",
  },
  {
    icon: Settings,
    title: "2. Encaixe a porca prateada",
    desc: "Rosqueie a porca prateada de acoplamento na torneira. Se necessário, use o adaptador universal que vem na caixa.",
  },
  {
    icon: Droplet,
    title: "3. Trave o aquecedor",
    desc: "Encaixe o AquaLux Digital na porca prateada e trave girando até ficar firme. Pronto para conectar na tomada (bivolt 110V/127V/220V).",
  },
  {
    icon: Thermometer,
    title: "4. Ligue e ajuste a temperatura",
    desc: "Abra o fluxo de água, gire o seletor para cima para água quente ou para baixo para água fria. Display mostra a temperatura em tempo real.",
  },
]

export function Installation() {
  return (
    <section className="bg-background py-8">
      <div className="mx-auto max-w-3xl space-y-6 px-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <Image
            src="/images/banner-instalacao-facil.png"
            alt="Instalação fácil em poucos passos: desparafuse a saída, coloque a porca prateada, trave o encaixe e coloque o aquecedor"
            width={512}
            height={464}
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full"
          />
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <h2 className="flex items-center justify-center gap-2 font-heading text-2xl font-bold text-foreground">
              <Wrench className="size-6 text-accent" /> Instalação fácil em 4 passos
            </h2>
            <p className="mx-auto mt-2 max-w-md text-pretty text-sm text-muted-foreground">
              Sem obras, sem encanador, sem complicação. Em poucos minutos a sua torneira tem água quente instantânea.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {steps.map((s) => (
              <div key={s.title} className="flex items-start gap-4 rounded-xl bg-secondary/60 p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-background text-brand-navy">
                  <s.icon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-accent/40 bg-accent/5 p-4 text-center">
            <p className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
              <Zap className="size-4 text-accent" />
              <span>
                <span className="font-bold">Bivolt (110V/127V/220V)</span> — compatível com a maioria das torneiras com bico externo.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
