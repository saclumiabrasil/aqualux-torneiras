import { ShoppingBag, Star, Truck } from "lucide-react"

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-gradient-to-b from-brand-navy-deep to-brand-navy text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
            <Truck className="size-4 text-brand-sky" />
            Envio imediato para todo o Brasil
          </span>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Hidratação com <span className="text-brand-sky">estilo</span> e alta performance
          </h1>
          <p className="mx-auto mt-4 max-w-md text-pretty text-white/70 md:mx-0">
            Garrafas premium que mantêm sua bebida na temperatura ideal por horas. Design elegante,
            materiais livres de BPA e qualidade que acompanha o seu dia.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
            <a
              href="#produtos"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-accent-foreground transition-colors hover:brightness-95 sm:w-auto"
            >
              <ShoppingBag className="size-5" />
              Comprar agora
            </a>
            <a
              href="#produtos"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Ver coleção
            </a>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/70 md:justify-start">
            <div className="flex text-brand-sky">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <span>+12.000 clientes hidratados com a AquaLux</span>
          </div>
        </div>

        <div className="relative mx-auto max-w-sm md:max-w-none">
          <div className="absolute inset-0 -z-0 rounded-full bg-brand-sky/20 blur-3xl" />
          <img
            src="/images/hero-bottle.png"
            alt="Garrafa térmica AquaLux azul com respingos de água"
            className="relative z-10 mx-auto w-full drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}
