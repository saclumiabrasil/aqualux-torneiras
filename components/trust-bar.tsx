import { PaymentMethods } from "@/components/payment-methods"

export function TrustBar() {
  return (
    <section className="bg-background pb-6">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-2xl bg-brand-navy-deep p-6 text-center shadow-sm">
          <p className="mb-4 text-sm font-semibold text-white">Nós aceitamos</p>
          <PaymentMethods />
        </div>
      </div>
    </section>
  )
}
