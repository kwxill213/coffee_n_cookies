import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import db from '@/db';
import { usersTable, cartTable, cartItemsTable } from '@/db/schema';

export async function POST(
  req: NextRequest, 
  context: { params: Promise<{ phone: string }> }
) {
  try {
    const { phone } = await context.params;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.phone, phone));

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { productId, quantity, selectedToppings } = await req.json();

    // Логирование и валидация входящих данных
    console.log('Входящие данные:', { productId, quantity, selectedToppings });

    // Валидация quantity
    const validQuantity = Number(quantity);
    if (isNaN(validQuantity) || validQuantity < 1) {
      return NextResponse.json({ error: 'Некорректное количество товара' }, { status: 400 });
    }

    // Находим или создаем корзину для пользователя
    const [existingCart] = await db
      .select()
      .from(cartTable)
      .where(eq(cartTable.user_id, user.id));

    let cartId;
    if (!existingCart) {
      const result = await db
        .insert(cartTable)
        .values({ user_id: user.id })
        .$returningId();
      
      cartId = result[0].id;
    } else {
      cartId = existingCart.id;
    }

    // Проверяем, существует ли уже такой товар в корзине
    const [existingCartItem] = await db
      .select()
      .from(cartItemsTable)
      .where(and(
        eq(cartItemsTable.cart_id, cartId),
        eq(cartItemsTable.product_id, productId)
      ));

    if (existingCartItem) {
      // Обновляем количество, если товар уже есть
      await db
        .update(cartItemsTable)
        .set({ quantity: existingCartItem.quantity + validQuantity })
        .where(eq(cartItemsTable.id, existingCartItem.id));
    } else {
      // Добавляем новый товар в корзину
      await db.insert(cartItemsTable).values({
        cart_id: cartId,
        product_id: productId,
        quantity: validQuantity,
      });
    }

    // Обработка дополнительных ингредиентов (если необходимо)
    if (selectedToppings && selectedToppings.length > 0) {
      // Здесь можно добавить логику сохранения выбранных топпингов
      console.log('Выбранные топпинги:', selectedToppings);
    }

    return NextResponse.json({ message: 'Товар добавлен в корзину' }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при добавлении товара в корзину:', error);
    return NextResponse.json({ error: 'Не удалось добавить товар в корзину' }, { status: 500 });
  }
}
