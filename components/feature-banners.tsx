import Image from "next/image"
import { Droplet, Flame, ShieldCheck, Wrench, Link2 } from "lucide-react"

const heatingSteps = [
  { time: "1s", icon: Droplet, title: "Inicia o aquecimento", desc: "O fluxo de água ativa o sistema." },
  { time: "3s", icon: Flame, title: "Água quente disponível", desc: "Aquece rapidamente em apenas 3 segundos." },
  { time: "10s+", icon: ShieldCheck, title: "Temperatura constante", desc: "Mantém a água quente enquanto o fluxo estiver ativo." },
]

const installFeatures = [
  { icon: Wrench, title: "Instalação rápida", desc: "sem ferramentas" },
  { icon: ShieldCheck, title: "Compatível", desc: "com a maioria das torneiras" },
  { icon: Link2, title: "Conexão segura", desc: "e vedação eficiente" },
]

export function FeatureBanners() {
  return (
    <section className="bg-muted/40 py-8">
      <div className="mx-auto max-w-6xl space-y-6 px-4">
        {/* Banner Aquecimento Rápido */}
        <div className="overflow-hidden rounded-2xl bg-background shadow-sm">
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
            <Image
              src="/images/heater-kitchen.png"
              alt="Água quente saindo da torneira com o AquaLux Digital"
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/20 to-transparent" />
            <div className="absolute left-5 top-5">
              <h2 className="font-heading text-2xl font-extrabold leading-tight text-brand-navy sm:text-3xl">
                Aquecimento Rápido
                <br />
                em <span className="text-accent">3 Segundos</span>
              </h2>
            </div>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-3">
            {heatingSteps.map((s) => (
              <div key={s.time} className="flex items-start gap-3 rounded-xl bg-secondary p-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
                  {s.time}
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banner Instalação Simples */}
        <div className="overflow-hidden rounded-2xl bg-background shadow-sm">
          <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-secondary to-background sm:aspect-[16/9]">
            <Image
              src="/images/heater-banner.png"
              alt="Aquecedor AquaLux Digital com destaque de instalação"
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-contain"
            />
            <div className="absolute left-1/2 top-5 -translate-x-1/2 text-center">
              <h2 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">Instalação Simples</h2>
              <p className="text-sm text-muted-foreground">Compatibilidade máxima</p>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
            {installFeatures.map((f) => (
              <div key={f.title} className="flex flex-col items-center gap-1.5 p-4 text-center">
                <f.icon className="size-6 text-accent" />
                <p className="text-xs font-semibold text-foreground">{f.title}</p>
                <p className="text-[11px] text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
