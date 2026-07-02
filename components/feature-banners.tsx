import Image from "next/image"

const banners = [
  {
    src: "/images/banner-aquecimento.png",
    alt: "Aquecimento rápido em 3 segundos com o AquaLux Digital instalado na torneira",
    width: 520,
    height: 492,
  },
  {
    src: "/images/banner-instalacao-simples.png",
    alt: "Instalação simples e compatibilidade máxima do AquaLux Digital",
    width: 520,
    height: 482,
  },
]

export function FeatureBanners() {
  return (
    <section className="bg-muted/40 py-8">
      <div className="mx-auto max-w-3xl space-y-6 px-4">
        {banners.map((b) => (
          <div key={b.src} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <Image
              src={b.src || "/placeholder.svg"}
              alt={b.alt}
              width={b.width}
              height={b.height}
              sizes="(max-width: 768px) 100vw, 768px"
              className="h-auto w-full"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
