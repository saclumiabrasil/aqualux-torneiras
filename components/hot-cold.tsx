import Image from "next/image"

export function HotCold() {
  return (
    <section className="bg-background py-8">
      <div className="mx-auto max-w-3xl px-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <Image
            src="/images/banner-agua-quente-fria.png"
            alt="AquaLux Digital com seletor de água quente e água fria, temperatura digital, mais segurança e economia de energia"
            width={512}
            height={490}
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  )
}
