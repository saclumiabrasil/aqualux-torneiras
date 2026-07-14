import { type NextRequest, NextResponse } from "next/server"
import { extractWebhookTransactionId, normalizeStatus, getTransaction } from "@/lib/pagou"
import { getOrderByTransactionId, getOrderById, updateOrderStatus } from "@/lib/db"

/**
 * Webhook do PagouAI. É a ÚNICA fonte de verdade para marcar um pedido como pago.
 * O PagouAI notifica esta rota quando o status da transação muda.
 */
export async function POST(req: NextRequest) {
  let payload: any
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 })
  }

  const transactionId = extractWebhookTransactionId(payload)
  if (!transactionId) {
    console.log("[v0] Webhook sem transactionId:", JSON.stringify(payload).slice(0, 300))
    return NextResponse.json({ received: true })
  }

  // Localiza o pedido pelo id da transação; se não achar, tenta pelo external_ref (orderId)
  let order = await getOrderByTransactionId(transactionId)
  if (!order) order = await getOrderById(transactionId)
  if (!order) {
    console.log("[v0] Webhook: pedido não encontrado para", transactionId)
    return NextResponse.json({ received: true })
  }

  // Reconsulta o status na API para confiar na fonte oficial (não só no corpo do webhook)
  let status = normalizeStatus(
    payload?.data?.status ?? payload?.transaction?.status ?? payload?.status,
  )
  try {
    const tx = await getTransaction(order.pagou_transaction_id ?? transactionId)
    status = tx.status
  } catch (err) {
    console.log("[v0] Webhook: falha ao reconsultar transação, usando status do payload.")
  }

  if (status !== order.status) {
    await updateOrderStatus(order.id, status)
  }

  return NextResponse.json({ received: true })
}
