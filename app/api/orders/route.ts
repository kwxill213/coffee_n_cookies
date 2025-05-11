// app/api/orders/route.ts
import db from '@/db'
import { ordersTable, orderItemsTable, usersTable, statusTable } from '@/db/schema'
import { desc, eq, sql } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

interface OrderItem {
  productId: number
  quantity: number
  price: number
}

export async function POST(req: Request) {
  try {
    const { deliveryMethod, address, restaurantId, items, phone } = await req.json()

    if (!phone) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    // Получаем ID пользователя
    const [user] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.phone, phone))

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

    // Создаем заказ и сразу получаем его ID
    const [order] = await db.insert(ordersTable).values({
      user_id: user.id,
      restaurant_id: deliveryMethod === 'pickup' ? restaurantId : null,
      address: deliveryMethod === 'delivery' ? address : null,
      status_id: 1, // "В обработке"
      total_amount: items.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0),
      delivery_time: new Date(Date.now() + (deliveryMethod === 'delivery' ? 45*60*1000 : 20*60*1000))
    }).$returningId()

    // Добавляем товары в заказ
    await db.insert(orderItemsTable).values(
      items.map((item: OrderItem) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    )

    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error('Ошибка при создании заказа:', error)
    return NextResponse.json(
      { error: 'Не удалось создать заказ' },
      { status: 500 }
    )
  }
}
