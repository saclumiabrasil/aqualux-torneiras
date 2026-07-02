import Image from "next/image"

const photos = [
  { src: "/images/review-1.png", alt: "Foto de cliente: aquecedor instalado na torneira da cozinha" },
  { src: "/images/review-2.png", alt: "Foto de cliente: aquecedor instalado no banheiro" },
  { src: "/images/review-3.png", alt: "Foto de cliente: aquecedor recém-chegado na embalagem" },
  { src: "/images/review-4.png", alt: "Foto de cliente: aquecedor em uso com água corrente" },
]

export function ReviewPhotosCarousel() {
  // Duplicamos a lista para criar um loop contínuo sem emendas
  const loop = [...photos, ...photos]

  return (
    <div className="marquee-track relative mt-6 overflow-hidden">
      <div className="flex w-max animate-marquee gap-3" style={{ ["--marquee-duration" as string]: "28s" }}>
        {loop.map((p, i) => (
          <div
            key={`${p.src}-${i}`}
            className="relative size-40 shrink-0 overflow-hidden rounded-xl bg-background shadow-sm"
          >
            <Image
              src={p.src || "/placeholder.svg"}
              alt={i < photos.length ? p.alt : ""}
              aria-hidden={i >= photos.length}
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {/* Fades laterais para suavizar as bordas */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-secondary/40 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-secondary/40 to-transparent" />
    </div>
  )
}
