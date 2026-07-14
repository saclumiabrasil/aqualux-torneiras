import { type NextRequest, NextResponse } from "next/server"
import { getOrderById } from "@/lib/db"
import { getTransaction, normalizeStatus } from "@/lib/pagou"

/**
 * Consulta o status de um pedido (usado pelo polling do Pix no checkout).
 * Também reconsulta o PagouAI como fallback caso o webhook ainda não tenha chegado.
 */
export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId")
  if (!orderId) {
    return NextResponse.json({ error: "orderId ausente." }, { status: 400 })
  }

  const order = await getOrderById(orderId)
  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 })
  }

  let status = order.status

  // Se ainda pendente, tenta reconsultar o gateway (fallback ao webhook)
  if (status === "pending" && order.pagou_transaction_id) {
    try {
      const tx = await getTransaction(order.pagou_transaction_id)
      status = normalizeStatus(tx.status)
    } catch {
      // mantém o status atual
    }
  }

  return NextResponse.json({ orderId: order.id, status, amountCents: order.amount_cents })
}
