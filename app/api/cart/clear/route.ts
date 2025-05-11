import { NextRequest, NextResponse } from 'next/server';
import db from '@/db';
import { eq } from 'drizzle-orm';
import { usersTable, cartTable, cartItemsTable } from '@/db/schema';

export async function DELETE(request: NextRequest) {
  try {
    const { phone } = await request.json();
    
    // Найдем пользователя
    const [user] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.phone, phone));

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    // Найдем корзину пользователя
    const [cart] = await db
      .select({ id: cartTable.id })
      .from(cartTable)
      .where(eq(cartTable.user_id, user.id));

    if (!cart) {
      return NextResponse.json({ error: 'Корзина не найдена' }, { status: 404 });
    }

    // Удалим все товары из корзины
    await db
      .delete(cartItemsTable)
      .where(eq(cartItemsTable.cart_id, cart.id));

    return NextResponse.json({ message: 'Корзина очищена' }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при очистке корзины:', error);
    return NextResponse.json({ error: 'Не удалось очистить корзину' }, { status: 500 });
  }
}