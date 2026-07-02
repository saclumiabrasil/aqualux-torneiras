import type { Metadata } from "next"
import { PageShell, Section } from "@/components/page-shell"

export const metadata: Metadata = {
  title: "Termos de Uso | AquaLux",
  description: "Conheça os termos e condições de uso do site e das compras realizadas na AquaLux.",
}

export default function Page() {
  return (
    <PageShell
      title="Termos de Uso"
      intro="Ao navegar e realizar compras neste site, você concorda com os termos e condições descritos abaixo."
    >
      <Section heading="Aceitação dos termos">
        <p>
          O uso deste site implica a aceitação integral destes Termos de Uso. Caso não concorde com qualquer condição,
          recomendamos que não utilize a plataforma.
        </p>
      </Section>

      <Section heading="Cadastro e informações">
        <p>
          Você se compromete a fornecer informações verdadeiras, completas e atualizadas no momento da compra. Dados
          incorretos podem impedir o processamento e a entrega do pedido.
        </p>
      </Section>

      <Section heading="Preços e disponibilidade">
        <p>
          Os preços e as condições de oferta são exclusivos deste site oficial e podem variar conforme a duração da
          promoção. Nos reservamos o direito de corrigir eventuais erros de digitação ou de estoque.
        </p>
      </Section>

      <Section heading="Uso do produto">
        <p>
          O produto deve ser utilizado conforme o manual de instruções que acompanha o item. O uso indevido pode
          comprometer o funcionamento e a segurança e não é coberto pela garantia.
        </p>
      </Section>

      <Section heading="Propriedade intelectual">
        <p>
          Todo o conteúdo do site, incluindo textos, imagens e marca, pertence à AquaLux e não pode ser reproduzido sem
          autorização prévia.
        </p>
      </Section>
    </PageShell>
  )
}
