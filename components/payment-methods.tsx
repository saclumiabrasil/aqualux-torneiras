import Image from "next/image"

const cards = [
  { name: "Pix", file: "pix" },
  { name: "Visa", file: "visa" },
  { name: "Mastercard", file: "mastercard" },
  { name: "Elo", file: "elo" },
  { name: "American Express", file: "amex" },
  { name: "Hipercard", file: "hipercard" },
  { name: "Discover", file: "discover" },
  { name: "Diners Club", file: "diners" },
]

export function PaymentMethods({ variant = "badges" }: { variant?: "badges" | "strip" }) {
  if (variant === "strip") {
    return (
      <div className="flex justify-center">
        <Image
          src="/images/cards-strip-transparent.png"
          alt="Formas de pagamento aceitas: Pix, Visa, Mastercard, Elo, American Express, Hipercard, Discover e Diners Club"
          width={336}
          height={42}
          sizes="(max-width: 480px) 90vw, 300px"
          className="h-auto w-full max-w-[300px] rounded-sm bg-white"
        />
      </div>
    )
  }

  return (
    <ul className="flex flex-wrap items-center justify-center gap-2.5">
      {cards.map((c) => (
        <li
          key={c.file}
          className="flex h-9 w-[52px] items-center justify-center overflow-hidden rounded-md bg-white shadow-sm"
        >
          <Image
            src={`/images/cards/${c.file}.png`}
            alt={c.name}
            width={120}
            height={40}
            sizes="52px"
            className="h-full w-full object-contain"
          />
        </li>
      ))}
    </ul>
  )
}
