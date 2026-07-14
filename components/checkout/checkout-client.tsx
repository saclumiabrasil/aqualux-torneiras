"use client"

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react"
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
import {
  Lock,
  Tag,
  Minus,
  Plus,
  Trash2,
  User,
  Truck,
  CreditCard,
  Check,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Zap,
  CircleCheck,
  ShoppingBag,
  Star,
  BadgeCheck,
  Gift,
  Loader2,
  Copy,
  CheckCheck,
} from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { Logo } from "@/components/logo"
import { PaymentMethods } from "@/components/payment-methods"
import { formatBRL } from "@/lib/checkout"
import {
  SHIPPING_OPTIONS,
  getShipping,
  getCoupon,
  maskCPF,
  maskPhone,
  maskCEP,
  onlyDigits,
  isValidEmail,
  type ShippingId,
} from "@/lib/checkout-helpers"
import { cn } from "@/lib/utils"

type Step = 0 | 1 | 2

type PixData = {
  orderId: string
  qrCode: string | null
  qrCodeBase64: string | null
  expiresAt: string | null
  amountCents: number
}

export type CardPaymentHandle = {
  tokenize: () => Promise<string | undefined>
}

const STEPS = [
  { label: "Identificação", icon: User },
  { label: "Entrega", icon: Truck },
  { label: "Pagamento", icon: CreditCard },
] as const

export function CheckoutClient() {
  const { lines, count, subtotal, hydrated, setQty, removeItem, clear } = useCart()

  const [step, setStep] = useState<Step>(0)
  const [submitted, setSubmitted] = useState(false)
  const [finalTotal, setFinalTotal] = useState(0)

  // Identificação
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [celular, setCelular] = useState("")

  // Entrega
  const [cep, setCep] = useState("")
  const [endereco, setEndereco] = useState("")
  const [numero, setNumero] = useState("")
  const [complemento, setComplemento] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [uf, setUf] = useState("")
  const [cepLoading, setCepLoading] = useState(false)
  const [frete, setFrete] = useState<ShippingId>("pac")

  // Pagamento
  const [payment, setPayment] = useState<"pix" | "card">("pix")
  const [parcelas, setParcelas] = useState("1")

  // Processamento / gateway
  const [processing, setProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  const [pix, setPix] = useState<PixData | null>(null)
  const cardRef = useRef<CardPaymentHandle>(null)

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Cupom
  const [couponInput, setCouponInput] = useState("")
  const [couponCodeApplied, setCouponCodeApplied] = useState("")
  const [couponError, setCouponError] = useState("")

  const shipping = getShipping(frete)
  const coupon = getCoupon(couponCodeApplied)
  const couponDiscount = coupon ? subtotal * coupon.percent : 0
  const pixDiscount = payment === "pix" ? subtotal * 0.1 : 0
  const total = Math.max(0, subtotal - couponDiscount - pixDiscount + shipping.price)
  const installmentValue = total / 12

  function applyCoupon() {
    const found = getCoupon(couponInput)
    if (!found) {
      setCouponError("Cupom inválido.")
      setCouponCodeApplied("")
      return
    }
    setCouponError("")
    setCouponCodeApplied(found.code)
  }

  async function handleCepBlur() {
    const digits = onlyDigits(cep)
    if (digits.length !== 8) return
    setCepLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setEndereco(data.logradouro || "")
        setBairro(data.bairro || "")
        setCidade(data.localidade || "")
        setUf(data.uf || "")
        setErrors((e) => ({ ...e, endereco: "", bairro: "", cidade: "" }))
      }
    } catch {
      // ignora falha de CEP
    } finally {
      setCepLoading(false)
    }
  }

  function validateStep(s: Step): boolean {
    const e: Record<string, string> = {}
    if (s === 0) {
      if (nome.trim().length < 3) e.nome = "Informe seu nome completo."
      if (!isValidEmail(email)) e.email = "Informe um e-mail válido."
      if (onlyDigits(cpf).length !== 11) e.cpf = "CPF inválido."
      if (onlyDigits(celular).length < 10) e.celular = "Informe um celular válido."
    }
    if (s === 1) {
      if (onlyDigits(cep).length !== 8) e.cep = "Informe o CEP."
      if (!endereco.trim()) e.endereco = "Informe o endereço."
      if (!numero.trim()) e.numero = "Nº"
      if (!bairro.trim()) e.bairro = "Informe o bairro."
      if (!cidade.trim()) e.cidade = "Informe a cidade."
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function goNext() {
    if (validateStep(step)) {
      setStep((s) => Math.min(2, s + 1) as Step)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1) as Step)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function fireConversion(value: number, orderId: string) {
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      ;(window as any).gtag("event", "conversion", {
        send_to: "AW-18273268399/t4_PCJf2gdAcEK_lr4lE",
        value,
        currency: "BRL",
        transaction_id: orderId,
      })
    }
  }

  function completeOrder(orderId: string) {
    fireConversion(total, orderId)
    setFinalTotal(total)
    setSubmitted(true)
    clear()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function finalize() {
    if (!validateStep(2)) return
    setPaymentError("")
    setProcessing(true)

    try {
      let cardToken: string | undefined
      if (payment === "card") {
        cardToken = await cardRef.current?.tokenize()
        if (!cardToken) {
          setPaymentError("Não foi possível validar os dados do cartão. Revise e tente novamente.")
          setProcessing(false)
          return
        }
      }

      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ kitId: l.kitId, qty: l.qty })),
          couponCode: couponCodeApplied || undefined,
          shippingId: frete,
          paymentMethod: payment === "pix" ? "pix" : "credit_card",
          cardToken,
          installments: Number(parcelas),
          customer: { name: nome, email, cpf, phone: celular },
          shipping: {
            cep,
            street: endereco,
            number: numero,
            complement: complemento,
            district: bairro,
            city: cidade,
            state: uf,
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setPaymentError(data?.error || "Não foi possível processar o pagamento. Tente novamente.")
        setProcessing(false)
        return
      }

      if (payment === "pix") {
        if (!data.pix?.qrCode && !data.pix?.qrCodeBase64) {
          setPaymentError("Não foi possível gerar o Pix. Tente novamente.")
          setProcessing(false)
          return
        }
        setPix({
          orderId: data.orderId,
          qrCode: data.pix?.qrCode ?? null,
          qrCodeBase64: data.pix?.qrCodeBase64 ?? null,
          expiresAt: data.pix?.expiresAt ?? null,
          amountCents: data.totalCents,
        })
        setProcessing(false)
        window.scrollTo({ top: 0, behavior: "smooth" })
        return
      }

      // Cartão
      if (data.status === "paid") {
        completeOrder(data.orderId)
      } else if (data.status === "pending") {
        setPaymentError("Pagamento em análise. Assim que aprovado, você receberá a confirmação por e-mail.")
        setProcessing(false)
      } else {
        setPaymentError("Pagamento não aprovado. Tente outro cartão ou use Pix.")
        setProcessing(false)
      }
    } catch {
      setPaymentError("Erro de conexão. Verifique sua internet e tente novamente.")
      setProcessing(false)
    }
  }

  // Pedido concluído
  if (submitted) {
    return <OrderConfirmation nome={nome} email={email} payment={payment} total={finalTotal} />
  }

  // Pagamento via Pix (aguardando confirmação)
  if (pix) {
    return (
      <PixPayment
        pix={pix}
        onPaid={() => completeOrder(pix.orderId)}
        onCancel={() => setPix(null)}
      />
    )
  }

  // Aguardando hidratação do carrinho
  if (!hydrated) {
    return <CheckoutHeaderShell />
  }

  // Carrinho vazio
  if (count === 0) {
    return (
      <div className="min-h-screen bg-secondary">
        <CheckoutHeader />
        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 px-6 py-24 text-center">
          <ShoppingBag className="size-16 text-muted-foreground/40" strokeWidth={1.5} />
          <h1 className="font-heading text-xl font-bold text-foreground">Seu carrinho está vazio</h1>
          <p className="text-sm text-muted-foreground">Adicione um kit AquaLux para finalizar a compra.</p>
          <Link
            href="/"
            className="rounded-xl bg-brand-navy px-6 py-3 font-heading text-sm font-bold text-white transition hover:brightness-110"
          >
            Voltar à loja
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary">
      <CheckoutHeader />

      {/* Banner promocional */}
      <div className="flex items-center justify-center gap-2.5 bg-brand-navy-deep px-4 py-3">
        <span className="shrink-0 text-lg leading-none" aria-hidden="true">
          🚚
        </span>
        <p className="text-center text-sm font-semibold leading-snug text-white text-balance">
          Você ganhou <span className="font-bold text-emerald-400">FRETE GRÁTIS</span> + Brinde exclusivo hoje!
        </p>
      </div>

      <div className="mx-auto max-w-md px-4 py-5">
        {/* Resumo do pedido */}
        <section className="rounded-2xl bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-foreground">Resumo do pedido</h2>
            <span className="font-heading text-lg font-extrabold text-brand-navy">R$ {formatBRL(total)}</span>
          </div>

          <ul className="mt-4 space-y-4">
            {lines.map((line) => (
              <li key={line.kitId} className="flex items-start gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-white">
                  <Image
                    src={line.kit.img || "/placeholder.svg"}
                    alt={line.kit.units}
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold leading-tight text-foreground">Aquecedor AquaLux Digital</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{line.kit.units}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.kitId)}
                      aria-label="Remover item"
                      className="mt-0.5 shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center rounded-lg border border-border">
                      <button
                        type="button"
                        onClick={() => setQty(line.kitId, line.qty - 1)}
                        aria-label="Diminuir quantidade"
                        className="inline-flex size-7 items-center justify-center text-brand-navy transition-colors hover:bg-secondary"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold tabular-nums">{line.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(line.kitId, line.qty + 1)}
                        aria-label="Aumentar quantidade"
                        className="inline-flex size-7 items-center justify-center text-brand-navy transition-colors hover:bg-secondary"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <p className="shrink-0 whitespace-nowrap text-right text-sm font-bold text-brand-navy">
                      R$ {formatBRL(line.lineTotal)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Brinde */}
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-emerald-400 bg-emerald-50 p-3">
            <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-white">
              <Image
                src="/images/brinde-adaptadores.png"
                alt="Kit de adaptadores + bico aerador"
                fill
                sizes="56px"
                className="object-contain p-1"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase leading-none text-emerald-600">
                <Gift className="size-3.5" /> Brinde grátis
              </p>
              <p className="mt-1 text-sm font-bold leading-tight text-foreground">
                Kit de adaptadores + bico aerador
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Incluso <span className="font-semibold text-foreground">no</span> seu pedido hoje
              </p>
            </div>
          </div>

          {/* Cupom */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
              <Tag className="size-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={couponInput}
                onChange={(ev) => setCouponInput(ev.target.value)}
                placeholder="Digite um cupom"
                aria-label="Cupom de desconto"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="button"
              onClick={applyCoupon}
              disabled={!couponInput.trim()}
              className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-brand-navy transition hover:brightness-95 disabled:opacity-50"
            >
              Aplicar
            </button>
          </div>
          {couponError && <p className="mt-1 text-xs text-destructive">{couponError}</p>}
          {coupon && <p className="mt-1 text-xs text-emerald-600">Cupom {coupon.code} aplicado.</p>}

          {/* Totais */}
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Produtos ({count})</dt>
              <dd className="text-foreground">R$ {formatBRL(subtotal)}</dd>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between">
                <dt className="text-emerald-600">Cupom ({coupon?.code})</dt>
                <dd className="text-emerald-600">- R$ {formatBRL(couponDiscount)}</dd>
              </div>
            )}
            {pixDiscount > 0 && (
              <div className="flex justify-between">
                <dt className="flex items-center gap-1.5 text-emerald-600">
                  Desconto
                  <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none text-white">
                    Pix
                  </span>
                </dt>
                <dd className="text-emerald-600">- R$ {formatBRL(pixDiscount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Frete</dt>
              <dd className={cn("font-semibold", shipping.price === 0 ? "text-emerald-600" : "text-foreground")}>
                {shipping.price === 0 ? "Grátis" : `R$ ${formatBRL(shipping.price)}`}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
            <span className="font-heading text-base font-bold text-foreground">Total</span>
            <div className="text-right">
              <p className="font-heading text-2xl font-extrabold leading-none text-brand-navy">R$ {formatBRL(total)}</p>
              <p className="mt-1 text-xs text-muted-foreground">ou 12x de R$ {formatBRL(installmentValue)}</p>
            </div>
          </div>
        </section>

        {/* Stepper */}
        <Stepper step={step} />

        {/* Etapas */}
        <section className="mt-4 rounded-2xl bg-card p-5 shadow-sm">
          {step === 0 && (
            <div>
              <h3 className="font-heading text-base font-bold text-foreground">
                Preencha seus dados para envio do pedido.
              </h3>
              <div className="mt-4 space-y-4">
                <Field label="Nome completo" error={errors.nome}>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome completo"
                    aria-label="Nome completo"
                    className={inputClass(errors.nome)}
                  />
                </Field>
                <Field label="E-mail" error={errors.email}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu e-mail"
                    aria-label="E-mail"
                    className={inputClass(errors.email)}
                  />
                </Field>
                <Field label="CPF" error={errors.cpf}>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cpf}
                    onChange={(e) => setCpf(maskCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    aria-label="CPF"
                    className={inputClass(errors.cpf)}
                  />
                </Field>
                <Field label="Celular/WhatsApp" error={errors.celular}>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={celular}
                    onChange={(e) => setCelular(maskPhone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    aria-label="Celular/WhatsApp"
                    className={inputClass(errors.celular)}
                  />
                </Field>

                <div className="flex items-center gap-3 rounded-xl bg-accent/10 p-3">
                  <Zap className="size-5 shrink-0 text-accent" />
                  <p className="text-sm text-foreground">
                    Você ganhou <span className="font-bold text-accent">10% de desconto</span> pagando com Pix
                  </p>
                </div>

                <PrimaryButton onClick={goNext}>
                  Ir Para Entrega <ArrowRight className="size-5" />
                </PrimaryButton>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="font-heading text-base font-bold text-foreground">Para onde enviamos o seu pedido?</h3>
              <div className="mt-4 space-y-4">
                <Field label="CEP" error={errors.cep}>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cep}
                      onChange={(e) => setCep(maskCEP(e.target.value))}
                      onBlur={handleCepBlur}
                      placeholder="00000-000"
                      aria-label="CEP"
                      className={cn(inputClass(errors.cep), "flex-1")}
                    />
                    {cepLoading ? (
                      <span className="shrink-0 text-xs font-medium text-muted-foreground">Buscando...</span>
                    ) : uf && cidade ? (
                      <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-emerald-600">
                        <CircleCheck className="size-4" />
                        {uf}/{cidade}
                      </span>
                    ) : null}
                  </div>
                </Field>
                <Field label="Endereço" error={errors.endereco}>
                  <input
                    type="text"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Rua, avenida..."
                    aria-label="Endereço"
                    className={inputClass(errors.endereco)}
                  />
                </Field>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <Field label="Número" error={errors.numero}>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        placeholder="Nº"
                        aria-label="Número"
                        className={inputClass(errors.numero)}
                      />
                    </Field>
                  </div>
                  <div className="col-span-2">
                    <Field label="Complemento (opcional)">
                      <input
                        type="text"
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                        placeholder="Apto, bloco..."
                        aria-label="Complemento"
                        className={inputClass()}
                      />
                    </Field>
                  </div>
                </div>
                <Field label="Bairro" error={errors.bairro}>
                  <input
                    type="text"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Seu bairro"
                    aria-label="Bairro"
                    className={inputClass(errors.bairro)}
                  />
                </Field>
                <Field label="Cidade" error={errors.cidade}>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Sua cidade"
                    aria-label="Cidade"
                    className={inputClass(errors.cidade)}
                  />
                </Field>

                {/* Frete */}
                <div>
                  <p className="text-sm font-bold text-foreground">Escolha o frete:</p>
                  <div className="mt-3 space-y-2.5">
                    {SHIPPING_OPTIONS.map((opt) => {
                      const selected = frete === opt.id
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setFrete(opt.id)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl border-2 p-3.5 text-left transition",
                            selected ? "border-brand-navy bg-brand-navy/5" : "border-border hover:border-brand-navy/40",
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                              selected ? "border-brand-navy" : "border-muted-foreground/40",
                            )}
                          >
                            {selected && <span className="size-2.5 rounded-full bg-brand-navy" />}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-foreground">{opt.name}</p>
                            <p className="text-xs text-muted-foreground">{opt.eta}</p>
                          </div>
                          <span
                            className={cn(
                              "text-sm font-bold",
                              opt.price === 0 ? "text-emerald-600" : "text-brand-navy",
                            )}
                          >
                            {opt.price === 0 ? "Grátis" : `R$ ${formatBRL(opt.price)}`}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BackButton onClick={goBack} />
                  <PrimaryButton onClick={goNext}>
                    Ir Para Pagamento <ArrowRight className="size-5" />
                  </PrimaryButton>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
                Forma de pagamento
              </h3>

              {/* Toggle Pix / Cartão */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPayment("pix")}
                  className={cn(
                    "relative rounded-xl border-2 p-3 text-center transition",
                    payment === "pix" ? "border-brand-navy bg-brand-navy/5" : "border-border",
                  )}
                >
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    10% DE DESCONTO
                  </span>
                  <span className="flex items-center justify-center gap-1.5 font-bold text-foreground">
                    <QrCode className="size-4" /> Pix
                  </span>
                  <span className="text-xs text-muted-foreground">Aprovação imediata</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayment("card")}
                  className={cn(
                    "flex items-center justify-center rounded-xl border-2 p-3 text-center transition",
                    payment === "card" ? "border-brand-navy bg-brand-navy/5" : "border-border",
                  )}
                >
                  <span className="flex items-center justify-center gap-1.5 font-bold text-foreground">
                    <CreditCard className="size-4" /> Cartão de crédito
                  </span>
                </button>
              </div>

              {payment === "pix" ? (
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3 rounded-xl bg-secondary p-4">
                    <QrCode className="size-6 shrink-0 text-brand-navy" />
                    <p className="text-sm text-foreground/90">
                      Ao finalizar o pedido, geramos um QR Code Pix para você pagar pelo app do seu banco. A confirmação
                      costuma ser em poucos segundos.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-secondary p-4">
                    <Truck className="size-6 shrink-0 text-brand-navy" />
                    <p className="text-sm text-foreground/90">
                      Pedidos pagos via Pix têm <span className="font-bold">envio imediato</span>, sem esperar a
                      compensação.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <CardPaymentElement ref={cardRef} />
                  <Field label="Parcelas">
                    <select
                      value={parcelas}
                      onChange={(e) => setParcelas(e.target.value)}
                      aria-label="Parcelas"
                      className={inputClass()}
                    >
                      {Array.from({ length: 12 }).map((_, i) => {
                        const n = i + 1
                        const value = total / n
                        return (
                          <option key={n} value={String(n)}>
                            {n}x de R$ {formatBRL(value)}
                            {n === 1 ? " à vista" : " sem juros"}
                          </option>
                        )
                      })}
                    </select>
                  </Field>
                </div>
              )}

              {paymentError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
                >
                  {paymentError}
                </p>
              )}

              <div className="mt-5 flex items-center gap-3">
                <BackButton onClick={goBack} />
                <PrimaryButton onClick={finalize} disabled={processing}>
                  {processing ? (
                    <>
                      <Loader2 className="size-5 animate-spin" /> Processando...
                    </>
                  ) : (
                    <>
                      <Lock className="size-4" /> {payment === "pix" ? "Gerar Pix" : "Finalizar Pedido"}
                    </>
                  )}
                </PrimaryButton>
              </div>
            </div>
          )}
        </section>

        {/* Carrossel de confiança */}
        <TrustCarousel />
      </div>

      {/* Rodapé */}
      <CheckoutFooter />
    </div>
  )
}

/* ---------- Subcomponentes ---------- */

function CheckoutHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3.5">
        <Link href="/" aria-label="AquaLux - página inicial">
          <Logo />
        </Link>
        <div className="flex items-center gap-1.5 text-brand-navy">
          <Lock className="size-4" />
          <div className="leading-none">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Pagamento</p>
            <p className="text-xs font-bold">100% Seguro</p>
          </div>
        </div>
      </div>
    </header>
  )
}

function CheckoutHeaderShell() {
  return (
    <div className="min-h-screen bg-secondary">
      <CheckoutHeader />
      <div className="mx-auto max-w-md px-4 py-10">
        <div className="h-40 animate-pulse rounded-2xl bg-card" />
      </div>
    </div>
  )
}

function Stepper({ step }: { step: Step }) {
  return (
    <div className="mt-4 flex items-center justify-between px-2">
      {STEPS.map((s, i) => {
        const Icon = s.icon
        const done = i < step
        const active = i === step
        return (
          <div key={s.label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-full border-2 transition",
                  done && "border-brand-navy bg-brand-navy text-white",
                  active && "border-brand-sky bg-brand-sky text-white",
                  !done && !active && "border-border bg-background text-muted-foreground",
                )}
              >
                {done ? <Check className="size-5" /> : <Icon className="size-5" />}
              </span>
              <span
                className={cn(
                  "text-[11px] font-semibold",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span className={cn("mx-1 -mt-5 h-0.5 flex-1 rounded", done ? "bg-brand-navy" : "bg-border")} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-foreground">
        {label}
        {hint && <span className="text-xs font-normal text-emerald-600">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  )
}

function inputClass(error?: string) {
  return cn(
    "w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15",
    error ? "border-destructive" : "border-border",
  )
}

function PrimaryButton({
  onClick,
  children,
  disabled,
}: {
  onClick: () => void
  children: ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full flex-1 items-center justify-center gap-2 rounded-xl bg-brand-navy py-4 font-heading text-base font-bold text-white shadow-lg shadow-brand-navy/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Voltar"
      className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border-2 border-border text-brand-navy transition hover:bg-secondary"
    >
      <ArrowLeft className="size-5" />
    </button>
  )
}

function PixPayment({
  pix,
  onPaid,
  onCancel,
}: {
  pix: PixData
  onPaid: () => void
  onCancel: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [checking, setChecking] = useState(true)

  // Polling do status do pedido até confirmar o pagamento.
  useEffect(() => {
    let active = true
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/checkout/status?orderId=${pix.orderId}`, {
          cache: "no-store",
        })
        const data = await res.json()
        if (!active) return
        if (data.status === "paid") {
          clearInterval(interval)
          onPaid()
        } else if (["failed", "canceled", "refunded"].includes(data.status)) {
          clearInterval(interval)
          setChecking(false)
        }
      } catch {
        // tenta novamente no próximo ciclo
      }
    }, 4000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [pix.orderId, onPaid])

  async function copyCode() {
    if (!pix.qrCode) return
    try {
      await navigator.clipboard.writeText(pix.qrCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // ignora
    }
  }

  const qrSrc = pix.qrCodeBase64
    ? pix.qrCodeBase64.startsWith("data:")
      ? pix.qrCodeBase64
      : `data:image/png;base64,${pix.qrCodeBase64}`
    : null

  return (
    <div className="min-h-screen bg-secondary">
      <CheckoutHeader />
      <div className="mx-auto max-w-md px-4 py-8">
        <div className="rounded-2xl bg-background p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-brand-navy/10">
              <QrCode className="size-6 text-brand-navy" />
            </span>
            <h1 className="mt-3 font-heading text-xl font-bold text-foreground text-balance">
              Pague R$ {formatBRL(pix.amountCents / 100)} com Pix
            </h1>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              Escaneie o QR Code no app do seu banco ou use o código copia-e-cola. A confirmação é automática.
            </p>
          </div>

          {qrSrc && (
            <div className="mt-6 flex justify-center">
              <div className="rounded-xl border border-border bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrSrc || "/placeholder.svg"} alt="QR Code Pix" className="size-52" />
              </div>
            </div>
          )}

          {pix.qrCode && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Pix copia e cola
              </p>
              <div className="mt-2 flex items-stretch gap-2">
                <p className="min-w-0 flex-1 truncate rounded-xl border border-border bg-secondary px-3 py-3 text-xs text-foreground/80">
                  {pix.qrCode}
                </p>
                <button
                  type="button"
                  onClick={copyCode}
                  aria-label="Copiar código Pix"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-navy px-4 text-sm font-bold text-white transition hover:brightness-110"
                >
                  {copied ? <CheckCheck className="size-4" /> : <Copy className="size-4" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-foreground/80">
            {checking ? (
              <>
                <Loader2 className="size-4 animate-spin text-brand-navy" />
                Aguardando confirmação do pagamento...
              </>
            ) : (
              <span className="text-destructive">
                Pagamento não confirmado. Gere um novo Pix para tentar novamente.
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="mt-4 w-full text-center text-sm font-semibold text-muted-foreground underline underline-offset-4"
          >
            Voltar e escolher outra forma de pagamento
          </button>
        </div>
      </div>
      <CheckoutFooter />
    </div>
  )
}

const CardPaymentElement = forwardRef<CardPaymentHandle>(function CardPaymentElement(_props, ref) {
  const containerRef = useRef<HTMLDivElement>(null)
  const elementsRef = useRef<any>(null)
  const cardRef = useRef<any>(null)
  const [ready, setReady] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  const publicKey = process.env.NEXT_PUBLIC_PAGOU_PUBLISHABLE_KEY

  useEffect(() => {
    if (!scriptLoaded) return
    const Pagou = (window as any).Pagou
    if (!Pagou || !publicKey || !containerRef.current) return
    try {
      const elements = Pagou.elements({ publicKey })
      const card = elements.create("card")
      card.mount(containerRef.current)
      elementsRef.current = elements
      cardRef.current = card
      // Alguns SDKs emitem "ready"/"change"; habilitamos assim que montar.
      if (typeof card.on === "function") {
        card.on("ready", () => setReady(true))
      } else {
        setReady(true)
      }
      // fallback caso o evento "ready" não dispare
      const t = setTimeout(() => setReady(true), 1200)
      return () => clearTimeout(t)
    } catch (err) {
      console.log("[v0] Falha ao inicializar Payment Element:", err)
    }
  }, [scriptLoaded, publicKey])

  useImperativeHandle(ref, () => ({
    async tokenize() {
      const elements = elementsRef.current
      const card = cardRef.current
      if (!elements && !card) return undefined
      try {
        // Padrão documentado: elements.submit() retorna { token }
        if (elements && typeof elements.submit === "function") {
          const result = await elements.submit()
          return result?.token ?? result?.data?.token ?? result?.id
        }
        // Alternativas defensivas conforme a versão do SDK
        if (card && typeof card.createToken === "function") {
          const result = await card.createToken()
          return result?.token ?? result?.id
        }
        if (elements && typeof elements.createToken === "function") {
          const result = await elements.createToken()
          return result?.token ?? result?.id
        }
      } catch (err) {
        console.log("[v0] Falha ao tokenizar cartão:", err)
        return undefined
      }
      return undefined
    },
  }))

  if (!publicKey) {
    return (
      <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
        Pagamento com cartão indisponível: chave do PagouAI não configurada.
      </p>
    )
  }

  return (
    <>
      <Script
        src="https://js.pagou.ai/payments/v3.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Dados do cartão
        </p>
        <div
          ref={containerRef}
          className="min-h-14 rounded-xl border border-border bg-background px-3 py-3"
        />
        {!ready && (
          <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" /> Carregando pagamento seguro...
          </p>
        )}
      </div>
    </>
  )
})

type Slide =
  | {
      kind: "review"
      name: string
      avatar: string
      text: string
    }
  | {
      kind: "trust"
      image: string
      title: string
      text: string
    }

const SLIDES: Slide[] = [
  {
    kind: "trust",
    image: "/images/trust/correios.png",
    title: "Correios",
    text: "Trabalhamos com os Correios há mais de 5 anos, garantindo entregas rápidas e seguras para todo o Brasil.",
  },
  {
    kind: "trust",
    image: "/images/trust/devolucao.png",
    title: "Devolução Facilitada",
    text: "30 dias para troca ou devolução de forma simples, rápida e segura.",
  },
  {
    kind: "trust",
    image: "/images/trust/garantia.png",
    title: "Compra 100% Segura",
    text: "Seus dados protegidos durante toda a finalização da compra.",
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-3.5 fill-current" />
      ))}
    </div>
  )
}

function TrustCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const center = el.scrollLeft + el.clientWidth / 2
    const children = Array.from(el.children) as HTMLElement[]
    let idx = 0
    let best = Number.POSITIVE_INFINITY
    children.forEach((c, i) => {
      const cc = c.offsetLeft + c.offsetWidth / 2
      const d = Math.abs(cc - center)
      if (d < best) {
        best = d
        idx = i
      }
    })
    setActive(idx)
  }

  function goTo(i: number) {
    const el = scrollRef.current
    if (!el) return
    const child = el.children[i] as HTMLElement | undefined
    if (child) el.scrollTo({ left: child.offsetLeft, behavior: "smooth" })
  }

  return (
    <div className="mt-6">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SLIDES.map((slide, i) => (
          <article
            key={i}
            className="flex min-w-[82%] snap-start flex-col rounded-2xl bg-card p-4 shadow-sm"
          >
            {slide.kind === "review" ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-secondary">
                    <Image src={slide.avatar || "/placeholder.svg"} alt={slide.name} fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 text-sm font-bold text-foreground">
                      {slide.name}
                      <BadgeCheck className="size-4 text-brand-sky" />
                    </p>
                    <Stars />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">{slide.text}</p>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Stars />
                    <p className="mt-2 text-sm font-bold text-foreground">{slide.title}</p>
                  </div>
                  <div className="relative size-12 shrink-0">
                    <Image
                      src={slide.image || "/placeholder.svg"}
                      alt={slide.title}
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{slide.text}</p>
              </>
            )}
          </article>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir para o slide ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === active ? "w-5 bg-accent" : "w-1.5 bg-border",
            )}
          />
        ))}
      </div>
    </div>
  )
}

function CheckoutFooter() {
  return (
    <footer className="mt-8 bg-brand-navy-deep">
      <div className="mx-auto max-w-md px-4 py-8 text-center">
        <p className="font-heading text-sm font-bold text-white">Formas de pagamento</p>
        <div className="mt-4">
          <PaymentMethods variant="badges" />
        </div>
        <p className="mt-6 text-xs font-semibold text-white/80">AquaLux Ltda</p>
        <p className="mt-1 text-xs text-white/60">CNPJ: 04.735.986/0001-07</p>
        <p className="mt-1 text-xs leading-relaxed text-white/60">
          R. Quito do Guaraná, 260 — Lotes 22 e 07 da Qd 14
          <br />
          Distrito Municipal Pequeno — Rio Verde/GO, CEP 75910-580
        </p>
        <p className="mt-1 text-xs text-white/60">Telefone: (64) 3621-3655</p>
        <p className="mt-3 text-xs text-white/50">Todos os direitos reservados</p>
      </div>
    </footer>
  )
}

function OrderConfirmation({
  nome,
  email,
  payment,
  total,
}: {
  nome: string
  email: string
  payment: "pix" | "card"
  total: number
}) {
  const firstName = nome.trim().split(" ")[0] || "cliente"
  return (
    <div className="min-h-screen bg-secondary">
      <CheckoutHeader />
      <div className="mx-auto max-w-md px-4 py-10">
        <div className="rounded-2xl bg-card p-6 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CircleCheck className="size-9" />
          </div>
          <h1 className="mt-4 font-heading text-xl font-extrabold text-foreground">Pedido recebido!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Obrigado, {firstName}! Seu pedido de <span className="font-bold text-brand-navy">R$ {formatBRL(total)}</span>{" "}
            foi registrado com sucesso.
          </p>

          <div className="mt-5 flex items-start gap-3 rounded-xl bg-secondary p-4 text-left text-sm">
            {payment === "pix" ? (
              <>
                <QrCode className="mt-0.5 size-5 shrink-0 text-brand-navy" />
                <p className="text-foreground/90">
                  Enviamos o QR Code Pix e os detalhes do pagamento para{" "}
                  <span className="font-semibold break-words">{email}</span>. Após a confirmação, seu pedido é enviado
                  imediatamente.
                </p>
              </>
            ) : (
              <>
                <CreditCard className="mt-0.5 size-5 shrink-0 text-brand-navy" />
                <p className="text-foreground/90">
                  Pagamento no cartão aprovado. Os detalhes do pedido foram enviados para{" "}
                  <span className="font-semibold break-words">{email}</span>.
                </p>
              </>
            )}
          </div>

          <Link
            href="/"
            className="mt-6 flex items-center justify-center rounded-xl bg-brand-navy py-4 font-heading text-base font-bold text-white transition hover:brightness-110"
          >
            Voltar à loja
          </Link>
        </div>
      </div>
    </div>
  )
}
