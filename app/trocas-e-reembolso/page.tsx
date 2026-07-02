import type { Metadata } from "next"
import { PageShell, Section } from "@/components/page-shell"

export const metadata: Metadata = {
  title: "Trocas e Reembolso | AquaLux",
  description: "Saiba como solicitar trocas, devoluções e reembolsos dos produtos AquaLux.",
}

export default function Page() {
  return (
    <PageShell
      title="Trocas e Reembolso"
      intro="Sua satisfação é a nossa prioridade. Conheça as condições para trocas, devoluções e reembolsos."
    >
      <Section heading="Direito de arrependimento">
        <p>
          Conforme o Código de Defesa do Consumidor, você pode desistir da compra em até 7 dias corridos após o
          recebimento do produto, sem necessidade de justificativa.
        </p>
      </Section>

      <Section heading="Garantia de 30 dias">
        <p>
          Todos os produtos contam com garantia de 30 dias contra defeitos de fabricação. Caso identifique algum
          problema, entre em contato com o nosso atendimento para providenciarmos a troca.
        </p>
      </Section>

      <Section heading="Como solicitar">
        <ul className="list-disc space-y-1 pl-5">
          <li>Envie um e-mail para contato@suporteonlinebr.com com o número do pedido.</li>
          <li>Descreva o motivo da troca ou devolução e anexe fotos, se houver defeito.</li>
          <li>Nossa equipe responderá com as instruções de envio em até 2 dias úteis.</li>
        </ul>
      </Section>

      <Section heading="Condições para devolução">
        <p>
          O produto deve ser devolvido com todos os acessórios e, sempre que possível, na embalagem original. Itens com
          sinais de mau uso não são elegíveis para reembolso.
        </p>
      </Section>

      <Section heading="Reembolso">
        <p>
          Após recebermos e conferirmos o produto, o reembolso é processado em até 10 dias úteis. Compras no Pix são
          devolvidas via Pix e compras no cartão são estornadas na fatura.
        </p>
      </Section>
    </PageShell>
  )
}
