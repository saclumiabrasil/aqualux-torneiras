import type { Metadata } from "next"
import { PageShell, Section } from "@/components/page-shell"

export const metadata: Metadata = {
  title: "Política de Privacidade | AquaLux",
  description: "Entenda como a AquaLux coleta, usa e protege os seus dados pessoais.",
}

export default function Page() {
  return (
    <PageShell
      title="Política de Privacidade"
      intro="Levamos a sua privacidade a sério. Esta política explica como coletamos, usamos e protegemos seus dados pessoais."
    >
      <Section heading="Dados que coletamos">
        <p>
          Coletamos apenas as informações necessárias para processar o seu pedido, como nome, endereço, e-mail,
          telefone e dados de pagamento. Nunca armazenamos os dados completos do seu cartão.
        </p>
      </Section>

      <Section heading="Como usamos seus dados">
        <ul className="list-disc space-y-1 pl-5">
          <li>Processar e entregar o seu pedido</li>
          <li>Enviar atualizações sobre o status da compra</li>
          <li>Prestar suporte e atendimento ao cliente</li>
          <li>Cumprir obrigações legais e fiscais</li>
        </ul>
      </Section>

      <Section heading="Compartilhamento de dados">
        <p>
          Seus dados são compartilhados somente com parceiros essenciais para a entrega do pedido, como transportadoras
          e processadores de pagamento. Não vendemos suas informações a terceiros.
        </p>
      </Section>

      <Section heading="Seus direitos (LGPD)">
        <p>
          Você pode solicitar a qualquer momento o acesso, a correção ou a exclusão dos seus dados pessoais. Basta
          entrar em contato pelo nosso canal de atendimento.
        </p>
      </Section>

      <Section heading="Cookies">
        <p>
          Utilizamos cookies para melhorar a sua experiência de navegação e entender como o site é utilizado. Você pode
          gerenciar as preferências de cookies diretamente no seu navegador.
        </p>
      </Section>
    </PageShell>
  )
}
