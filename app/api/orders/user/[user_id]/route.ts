import db from "@/db";
import { ordersTable, statusTable, orderItemsTable } from "@/db/schema";
import { sql, eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest, 
  context: { params: Promise<{ user_id: string }> }

) {
  try {
  const { user_id } = await context.params
    const { searchParams } = new URL(req.url)
    const withOrders = searchParams.get('withOrders') === 'true'

    let orders: { id: number; status_id: number; status_name: string | null; total_amount: string; created_at: Date | null; items_count: number; }[] = []
    if (withOrders) {
      orders = await db
        .select({
          id: ordersTable.id,
          status_id: ordersTable.status_id,
          status_name: statusTable.name,
          total_amount: ordersTable.total_amount,
          created_at: ordersTable.created_at,
          items_count: sql<number>`count(${orderItemsTable.id})`
        })
        .from(ordersTable)
        .leftJoin(statusTable, eq(ordersTable.status_id, statusTable.id))
        .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.order_id))
        .where(eq(ordersTable.user_id, user_id))
        .groupBy(ordersTable.id, statusTable.name)
        .orderBy(desc(ordersTable.created_at))
    }
console.log('User ID для поиска заказов:', orders);

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error)
    return NextResponse.json(
      { error: 'Не удалось получить данные пользователя' },
      { status: 500 }
    )
  }
}