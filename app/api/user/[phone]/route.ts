// app/api/user/[phone]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/db';
import { desc, eq, sql } from 'drizzle-orm';
import { orderItemsTable, ordersTable, statusTable, usersTable } from '@/db/schema';

export async function GET(
  req: NextRequest, 
  context: { params: Promise<{ phone: string }> }
) {
  try {
    const { phone } = await context.params
    const { searchParams } = new URL(req.url)
    const withOrders = searchParams.get('withOrders') === 'true'

    const [user] = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        gender: usersTable.gender,
        created_at: usersTable.created_at,
        phone: usersTable.phone,
        adress: usersTable.adress,
        image_url: usersTable.image_url
      })
      .from(usersTable)
      .where(eq(usersTable.phone, phone))

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

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
        .where(eq(ordersTable.user_id, user.id))
        .groupBy(ordersTable.id, statusTable.name)
        .orderBy(desc(ordersTable.created_at))
    }

    return NextResponse.json({ user, orders })
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error)
    return NextResponse.json(
      { error: 'Не удалось получить данные пользователя' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ phone: string }> }

) {
  try {
    const { phone } = await context.params

    const data = await request.json();
    
    // Проверяем, что есть данные для обновления
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'Не предоставлены данные для обновления' },
        { status: 400 }
      );
    }

    // Подготавливаем объект для обновления
    const updateData: {
      username?: string;
      gender?: boolean | null;
      adress?: string;
      image_url?: string | null;
    } = {};

    // Заполняем только те поля, которые были переданы
    if (data.username !== undefined) updateData.username = data.username;
    if (data.gender !== undefined) {
      updateData.gender = data.gender === null ? null : Boolean(data.gender);
    }
    if (data.address !== undefined) updateData.adress = data.address;
    if (data.image_url !== undefined) updateData.image_url = data.image_url;

    // Обновляем данные пользователя
    await db.update(usersTable)
      .set(updateData)
      .where(eq(usersTable.phone, phone));

    // Получаем обновленные данные пользователя
    const [updatedUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.phone, phone));

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Ошибка обновления:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при обновлении данных пользователя' },
      { status: 500 }
    );
  }
}