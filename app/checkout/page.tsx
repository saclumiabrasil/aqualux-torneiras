import type { Metadata } from "next"
import { CheckoutClient } from "@/components/checkout/checkout-client"

export const metadata: Metadata = {
  title: "Finalizar Compra | AquaLux",
  description: "Conclua seu pedido AquaLux com segurança. Pagamento via Pix ou cartão de crédito e frete grátis.",
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
