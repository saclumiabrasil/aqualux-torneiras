import Image from "next/image"

export function PaymentMethods() {
  return (
    <Image
      src="/images/cards-strip-source.png"
      alt="Formas de pagamento aceitas: Pix, Visa, Mastercard, Elo, American Express, Hipercard, Discover e Diners Club"
      width={336}
      height={42}
      sizes="(max-width: 480px) 100vw, 336px"
      className="mx-auto h-auto w-full max-w-sm"
    />
  )
}
