"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Gift,
  ShieldCheck,
  Truck,
  Clock,
  ShoppingCart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatBRL, KITS } from "@/lib/checkout"
import { useKit } from "@/components/kit-provider"
import { useCart } from "@/components/cart-provider"

const gallery = [
  { src: "/images/hero-produto-real.png", alt: "AquaLux Digital instalado na torneira com display marcando 45 graus" },
  { src: "/images/banner-aquecimento.png", alt: "Aquecedor AquaLux com água quente saindo na pia da cozinha" },
  { src: "/images/banner-instalacao-simples.png", alt: "Aquecedor AquaLux Digital em destaque de instalação" },
  { src: "/images/banner-agua-quente-fria.png", alt: "AquaLux Digital com seletor de água quente e fria" },
  { src: "/images/banner-instalacao-facil.png", alt: "Passo a passo de instalação do AquaLux Digital" },
  { src: "/images/banner-compativel.png", alt: "Torneiras compatíveis com o AquaLux Digital" },
]

const benefits = [
  "Água quente instantânea em apenas 3 segundos",
  "Display digital com temperatura em tempo real",
  "Instalação simples, sem ferramentas ou obras",
  "Compatível com a maioria das torneiras (bivolt 110V/127V/220V)",
]

export function ProductHero() {
  const [active, setActive] = useState(0)
  const { kitId, setKitId, kit } = useKit()
  const { addItem } = useCart()
  const router = useRouter()
  const installment = formatBRL(kit.priceValue / 12)

  const buyNow = () => {
    addItem(kitId)
    router.push("/checkout")
  }

  const total = gallery.length
  const prev = () => setActive((i) => (i - 1 + total) % total)
  const next = () => setActive((i) => (i + 1) % total)

  return (
    <section id="inicio" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-6 lg:grid lg:grid-cols-2 lg:gap-10 lg:py-10">
        {/* Galeria */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-white">
            <Image
              src={gallery[active].src || "/placeholder.svg"}
              alt={gallery[active].alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
            />
            <button
              type="button"
              onClick={prev}
              aria-label="Imagem anterior"
              className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-primary shadow-md backdrop-blur transition hover:bg-background"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Próxima imagem"
              className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-primary shadow-md backdrop-blur transition hover:bg-background"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {gallery.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "size-1.5 rounded-full transition-all",
                    i === active ? "w-4 bg-accent" : "bg-primary/30",
                  )}
                />
              ))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-6 gap-2">
            {gallery.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver imagem ${i + 1}`}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-lg border-2 bg-white transition",
                  i === active ? "border-accent" : "border-transparent hover:border-border",
                )}
              >
                <Image src={img.src || "/placeholder.svg"} alt="" fill sizes="80px" className="object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Informações de compra */}
        <div className="mt-6 lg:mt-0">
          <div className="flex items-center gap-2">
            <div className="flex text-[#f5a623]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">4.9</span>
            <span className="text-sm text-muted-foreground">(3.127 avaliações)</span>
          </div>

          <h1 className="mt-3 text-balance font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            AquaLux Digital — Aquecedor Instantâneo Premium para Torneira (BIVOLT)
          </h1>

          {/* Bloco de preço */}
          <div className="mt-5 rounded-2xl border border-brand-navy/10 bg-secondary p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground line-through">{kit.old}</span>
              <span className="rounded-full bg-brand-navy-deep px-2.5 py-1 text-xs font-bold text-white">
                {kit.off} OFF
              </span>
            </div>
            <div className="mt-1 flex items-end gap-2">
              <p className="font-heading text-5xl font-extrabold leading-none tracking-tight text-brand-navy sm:text-6xl">
                {kit.price}
              </p>
              <span className="mb-1.5 rounded-md bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
                à vista
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              no Pix ou em até <span className="font-semibold text-foreground">12x de R$ {installment}</span> no cartão
            </p>
          </div>

          {/* Seletor de kit */}
          <div id="escolha-kit" className="mt-6 scroll-mt-24">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Escolha seu kit</h2>
              <span className="text-xs text-muted-foreground">3 opções</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {KITS.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setKitId(k.id)}
                  className={cn(
                    "relative flex flex-col rounded-xl border-2 bg-background p-2 text-left transition",
                    kitId === k.id ? "border-brand-navy" : "border-border hover:border-brand-navy/40",
                  )}
                >
                  {k.bestSeller && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-navy px-2 py-0.5 text-[10px] font-bold text-white">
                      ★ MAIS VENDIDO
                    </span>
                  )}
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white">
                    <Image src={k.img || "/placeholder.svg"} alt={k.units} fill sizes="120px" className="object-contain" />
                  </div>
                  <span className="mt-2 text-sm font-bold text-foreground">{k.units}</span>
                  <span className="text-[11px] leading-tight text-muted-foreground">{k.subtitle}</span>
                  <span className="mt-1 flex items-center gap-1">
                    <span className="text-[11px] text-muted-foreground line-through">{k.old}</span>
                    <span className="rounded bg-brand-navy px-1 text-[10px] font-bold text-white">-{k.off}</span>
                  </span>
                  <span className="text-sm font-bold text-brand-navy">{k.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Benefícios */}
          <div className="mt-6 rounded-2xl border border-border p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-foreground">
              <span className="text-accent">✦</span> BENEFÍCIOS
            </p>
            <ul className="mt-3 space-y-2.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check className="size-3.5" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Brinde */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-emerald-400/60 bg-emerald-50 p-4">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-white">
              <Image src="/images/kit-1.png" alt="Kit de adaptadores brinde" fill sizes="56px" className="object-contain" />
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                <Gift className="size-4" /> BRINDE GRÁTIS
              </p>
              <p className="text-sm font-semibold text-foreground">Kit de adaptadores + bico aerador</p>
              <p className="text-xs text-muted-foreground">
                Incluso <span className="font-semibold text-emerald-600">no</span> seu pedido hoje
              </p>
            </div>
          </div>

          {/* CTA */}
          <button
            id="comprar"
            type="button"
            onClick={buyNow}
            className="mt-5 flex w-full scroll-mt-24 items-center justify-center rounded-xl bg-brand-navy py-4 font-heading text-lg font-bold text-white shadow-lg shadow-brand-navy/20 transition hover:brightness-110"
          >
            COMPRAR AGORA
          </button>
          <button
            type="button"
            onClick={() => addItem(kitId)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-brand-navy bg-background py-3.5 font-heading text-base font-bold text-brand-navy transition hover:bg-secondary"
          >
            <ShoppingCart className="size-5" />
            Adicionar ao Carrinho
          </button>

          {/* Selos */}
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-5 text-center">
            <TrustBadge icon={ShieldCheck} label="Compra segura" />
            <TrustBadge icon={Truck} label="Frete grátis" />
            <TrustBadge icon={Clock} label="Garantia 30 dias" />
          </div>

          {/* Bandeiras aceitas em uma única linha */}
          <div className="mt-4 flex justify-center">
            <Image
              src="/images/cards-strip-source.png"
              alt="Formas de pagamento aceitas: Pix, Visa, Mastercard, Elo, American Express, Hipercard, Discover e Diners Club"
              width={336}
              height={42}
              sizes="(max-width: 480px) 80vw, 300px"
              className="h-auto w-full max-w-[300px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustBadge({ icon: Icon, label }: { icon: typeof ShieldCheck; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Icon className="size-5 text-brand-navy" />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
