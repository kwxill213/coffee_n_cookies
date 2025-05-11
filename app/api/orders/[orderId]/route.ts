import db from '@/db'
import { ordersTable, orderItemsTable, productsTable, restaurantsTable, statusTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
export async function GET(
  req: Request,
  context: { params: Promise<{ orderId: string }> }

) {
  try {
    const orderId = parseInt((await context.params).orderId)

    
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    // Получаем основной заказ
    const [order] = await db
      .select({
        id: ordersTable.id,
        user_id: ordersTable.user_id,
        restaurant_id: ordersTable.restaurant_id,
        restaurant_name: restaurantsTable.name,
        address: ordersTable.address,
        status_id: ordersTable.status_id,
        status_name: statusTable.name,
        total_amount: ordersTable.total_amount,
        created_at: ordersTable.created_at,
        delivery_time: ordersTable.delivery_time
      })
      .from(ordersTable)
      .leftJoin(restaurantsTable, eq(ordersTable.restaurant_id, restaurantsTable.id))
      .leftJoin(statusTable, eq(ordersTable.status_id, statusTable.id))
      .where(eq(ordersTable.id, orderId))

    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 })
    }

    // Получаем товары заказа
    const items = await db
      .select({
        id: orderItemsTable.id,
        product_id: orderItemsTable.product_id,
        product_name: productsTable.name,
        product_price: productsTable.price, // Исправлено: берем цену из productsTable
        quantity: orderItemsTable.quantity
      })
      .from(orderItemsTable)
      .leftJoin(productsTable, eq(orderItemsTable.product_id, productsTable.id))
      .where(eq(orderItemsTable.order_id, orderId))

    return NextResponse.json({ ...order, items })
  } catch (error) {
    console.error('Ошибка при получении заказа:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении заказа' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = parseInt(params.orderId)
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    const { statusId } = await req.json()
    
    await db
      .update(ordersTable)
      .set({ status_id: statusId })
      .where(eq(ordersTable.id, orderId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ошибка при обновлении заказа:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении заказа' },
      { status: 500 }
    )
  }
}