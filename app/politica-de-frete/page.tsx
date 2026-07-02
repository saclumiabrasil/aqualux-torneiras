import type { Metadata } from "next"
import { PageShell, Section } from "@/components/page-shell"

export const metadata: Metadata = {
  title: "Política de Frete | AquaLux",
  description: "Saiba como funcionam os prazos de envio, entrega e frete grátis dos produtos AquaLux.",
}

export default function Page() {
  return (
    <PageShell
      title="Política de Frete"
      intro="Enviamos para todo o Brasil com frete grátis e despacho imediato. Confira abaixo os detalhes de envio e entrega."
    >
      <Section heading="Frete grátis para todo o Brasil">
        <p>
          Todos os pedidos realizados neste site oficial contam com frete grátis, sem valor mínimo de compra. O custo
          do envio já está incluído no preço final exibido no checkout.
        </p>
      </Section>

      <Section heading="Prazo de postagem">
        <p>
          Os pedidos aprovados são separados e postados em até 1 dia útil. Após a postagem, você recebe o código de
          rastreio por e-mail para acompanhar cada etapa da entrega.
        </p>
      </Section>

      <Section heading="Prazo de entrega estimado">
        <ul className="list-disc space-y-1 pl-5">
          <li>Sudeste: de 3 a 7 dias úteis</li>
          <li>Sul e Centro-Oeste: de 5 a 10 dias úteis</li>
          <li>Nordeste: de 7 a 12 dias úteis</li>
          <li>Norte: de 8 a 15 dias úteis</li>
        </ul>
        <p>
          Os prazos são estimados e contados a partir da confirmação do pagamento. Regiões de difícil acesso podem ter
          prazos adicionais.
        </p>
      </Section>

      <Section heading="Acompanhamento do pedido">
        <p>
          Assim que o pedido for despachado, o código de rastreio fica disponível na página de Rastrear Pedido e também
          é enviado para o seu e-mail de cadastro.
        </p>
      </Section>

      <Section heading="Endereço incorreto ou ausência no recebimento">
        <p>
          Confira sempre o endereço informado no momento da compra. Em caso de dados incorretos ou tentativas de
          entrega sem sucesso, entre em contato com o nosso atendimento para reagendarmos o envio.
        </p>
      </Section>
    </PageShell>
  )
}
