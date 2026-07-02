import type { Metadata } from "next"
import { PageShell, Section } from "@/components/page-shell"

export const metadata: Metadata = {
  title: "Pagamento Seguro | AquaLux",
  description: "Entenda como protegemos os seus dados e quais formas de pagamento são aceitas na AquaLux.",
}

export default function Page() {
  return (
    <PageShell
      title="Pagamento Seguro"
      intro="Sua compra é protegida de ponta a ponta. Utilizamos gateways de pagamento confiáveis e criptografia para manter seus dados seguros."
    >
      <Section heading="Ambiente 100% protegido">
        <p>
          Todas as transações são processadas em ambiente criptografado (SSL) por gateways de pagamento reconhecidos no
          mercado. Nunca temos acesso aos dados completos do seu cartão.
        </p>
      </Section>

      <Section heading="Formas de pagamento aceitas">
        <ul className="list-disc space-y-1 pl-5">
          <li>Pix (aprovação imediata)</li>
          <li>Cartão de crédito: Visa, Mastercard, Elo, American Express, Hipercard, Discover e Diners</li>
          <li>Parcelamento em até 12x no cartão</li>
        </ul>
      </Section>

      <Section heading="Aprovação do pagamento">
        <p>
          Pagamentos via Pix são confirmados em poucos minutos. Compras no cartão de crédito passam por análise
          antifraude e costumam ser aprovadas em instantes.
        </p>
      </Section>

      <Section heading="Proteção de dados">
        <p>
          Seguimos as diretrizes da Lei Geral de Proteção de Dados (LGPD). Suas informações são utilizadas somente para
          o processamento do pedido e nunca são compartilhadas com terceiros sem autorização.
        </p>
      </Section>
    </PageShell>
  )
}
