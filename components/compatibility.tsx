import Image from "next/image"
import { ShieldCheck } from "lucide-react"

export function Compatibility() {
  return (
    <section className="bg-background py-8">
      <div className="mx-auto max-w-3xl px-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <Image
            src="/images/banner-compativel.png"
            alt="Modelos de torneiras não compatíveis e compatíveis com o AquaLux Digital"
            width={512}
            height={355}
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full"
          />
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-accent/40 bg-accent/5 p-4">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Antes da compra, verifique o formato da sua torneira.</span>{" "}
            Compatível apenas com torneiras que possuem bico externo.
          </p>
        </div>
      </div>
    </section>
  )
}
