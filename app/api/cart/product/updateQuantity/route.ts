import { NextRequest, NextResponse } from 'next/server';
import db from '@/db';
import { eq, and } from 'drizzle-orm';
import { usersTable, cartTable, cartItemsTable } from '@/db/schema';

export async function PATCH(request: NextRequest) {
  try {
    const { productId, phone, quantity } = await request.json();
    
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

    // Проверим, что товар есть в корзине
    const [existingCartItem] = await db
      .select()
      .from(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.cart_id, cart.id),
          eq(cartItemsTable.product_id, productId)
        )
      );

    if (!existingCartItem) {
      return NextResponse.json({ error: 'Товар не найден в корзине' }, { status: 404 });
    }

    // Обновим количество товара в корзине
    await db
      .update(cartItemsTable)
      .set({ quantity: Number(quantity) })
      .where(
        and(
          eq(cartItemsTable.cart_id, cart.id),
          eq(cartItemsTable.product_id, productId)
        )
      );

    return NextResponse.json({ message: 'Количество товара обновлено' }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при обновлении количества товара:', error);
    return NextResponse.json({ error: 'Не удалось обновить количество' }, { status: 500 });
  }
}