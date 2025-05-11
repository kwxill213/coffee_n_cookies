import db from '@/db'
import { ordersTable, statusTable } from '@/db/schema'
import { eq, and, lt } from 'drizzle-orm'

export async function updateOrderStatuses() {
  // 1. Находим заказы "В обработке" старше 5 минут
  const processingOrders = await db
    .select()
    .from(ordersTable)
    .where(
      and(
        eq(ordersTable.status_id, 1),
        lt(ordersTable.created_at, new Date(Date.now() - 5 * 60 * 1000))
      )
    )

  if (processingOrders.length) {
    await db
      .update(ordersTable)
      .set({ status_id: 2 }) // "Готовится"
      .where(eq(ordersTable.status_id, 1))
  }

  // 2. Находим заказы "Готовится" старше 15 минут
  const cookingOrders = await db
    .select()
    .from(ordersTable)
    .where(
      and(
        eq(ordersTable.status_id, 2),
        lt(ordersTable.created_at, new Date(Date.now() - 15 * 60 * 1000))
      )
    )

  if (cookingOrders.length) {
    await db
      .update(ordersTable)
      .set({ status_id: 3 }) // "В пути" или "Готов к выдаче"
      .where(eq(ordersTable.status_id, 2))
  }

  // 3. Находим заказы "В пути" старше 30 минут
  const deliveringOrders = await db
    .select()
    .from(ordersTable)
    .where(
      and(
        eq(ordersTable.status_id, 3),
        lt(ordersTable.created_at, new Date(Date.now() - 30 * 60 * 1000)),
        eq(ordersTable.restaurant_id, null) // Только для доставки
      )
    )

  if (deliveringOrders.length) {
    await db
      .update(ordersTable)
      .set({ status_id: 4 }) // "Доставлен"
      .where(eq(ordersTable.status_id, 3))
  }
}

// Запускаем каждые 5 минут
setInterval(updateOrderStatuses, 5 * 60 * 1000)