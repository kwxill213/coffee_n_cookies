import { NextRequest, NextResponse } from 'next/server';
import db from '@/db';
import { and, eq, or, like, sql } from 'drizzle-orm';
import { ordersTable, usersTable, statusTable, orderItemsTable } from '@/db/schema';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get('search') || '';
    const searchType = searchParams.get('searchType') || 'all';
    const statusId = searchParams.get('statusId');

    // Базовый запрос с джоинами
    let query = db
      .select({
        id: ordersTable.id,
        user_id: ordersTable.user_id,
        username: usersTable.username,
        phone: usersTable.phone,
        total_amount: ordersTable.total_amount,
        address: ordersTable.address,
        status_id: ordersTable.status_id,
        status_name: statusTable.name,
        created_at: ordersTable.created_at,
        delivery_time: ordersTable.delivery_time,
        items_count: sql<number>`count(${orderItemsTable.id})`
      })
      .from(ordersTable)
      .leftJoin(usersTable, eq(ordersTable.user_id, usersTable.id))
      .leftJoin(statusTable, eq(ordersTable.status_id, statusTable.id))
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.order_id))
      .groupBy(ordersTable.id, usersTable.username, usersTable.phone, statusTable.name);

    // Добавляем условия поиска в зависимости от типа
    if (searchTerm) {
      switch (searchType) {
        case 'id':
          query = query.where(like(ordersTable.id, `%${searchTerm}%`));
          break;
        case 'phone':
          query = query.where(like(usersTable.phone, `%${searchTerm}%`));
          break;
        case 'name':
          query = query.where(like(usersTable.username, `%${searchTerm}%`));
          break;
        default:
          query = query.where(
            or(
              like(ordersTable.id, `%${searchTerm}%`),
              like(usersTable.phone, `%${searchTerm}%`),
              like(usersTable.username, `%${searchTerm}%`)
            )
          );
      }
    }

    // Фильтр по статусу
    if (statusId) {
      query = query.where(eq(ordersTable.status_id, parseInt(statusId)));
    }

    const orders = await query;

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    return NextResponse.json(
      { error: 'Не удалось получить заказы' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { orderId, statusId } = await req.json();

    await db
      .update(ordersTable)
      .set({ status_id: statusId })
      .where(eq(ordersTable.id, orderId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении статуса:', error);
    return NextResponse.json(
      { error: 'Не удалось обновить статус' },
      { status: 500 }
    );
  }
}