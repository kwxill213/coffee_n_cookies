// app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/db';
import { eq } from 'drizzle-orm';
import { usersTable, productsTable, cartItemsTable, cartTable } from '@/db/schema';

export async function GET(
  req: NextRequest, 
  context: { params: Promise<{ phone: string }> }
) {
    try {
        const { phone } = await context.params;

        // Найдем пользователя
        const [user] = await db
            .select({ id: usersTable.id })
            .from(usersTable)
            .where(eq(usersTable.phone, phone));

        if (!user) {
            return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
        }

        // Найдем корзину пользователя с полной информацией о товарах
        const cartItems = await db
            .select({
                id: productsTable.id,
                name: productsTable.name,
                description: productsTable.description,
                price: productsTable.price,
                image_url: productsTable.image_url,
                quantity: cartItemsTable.quantity
            })
            .from(cartTable)
            .innerJoin(cartItemsTable, eq(cartTable.id, cartItemsTable.cart_id))
            .innerJoin(productsTable, eq(cartItemsTable.product_id, productsTable.id))
            .where(eq(cartTable.user_id, user.id));

        return NextResponse.json(cartItems, { status: 200 });
    } catch (error) {
        console.error('Ошибка при получении корзины: ', error);
        return NextResponse.json({ message: "Ошибка при получении корзины" }, { status: 500 });
    }
}
