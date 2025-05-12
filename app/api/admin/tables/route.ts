// app/api/admin/tables/route.ts
import { NextResponse } from 'next/server';
import db from '@/db';
import { eq, and } from 'drizzle-orm';

// Вспомогательная функция для обработки ошибок
const handleError = (error: unknown, message: string) => {
  console.error(`${message}:`, error);
  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
};

// GET все таблицы с метаданными
export async function GET() {
  try {
    const tablesMeta = [
      { name: 'Users', description: 'Пользователи системы' },
      { name: 'Status', description: 'Статусы заказов' },
      { name: 'Category', description: 'Категории товаров' },
      { name: 'Products', description: 'Товары/продукты' },
      { name: 'Cart', description: 'Корзины пользователей' },
      { name: 'Cart_Items', description: 'Элементы корзин' },
      { name: 'Orders', description: 'Заказы' },
      { name: 'Order_Items', description: 'Элементы заказов' },
      { name: 'Restaraunts', description: 'Рестораны' },
      { name: 'Promotions', description: 'Акции' },
      { name: 'ContactMessages', description: 'Обращения' }
    ];

    return NextResponse.json({ tables: tablesMeta });
  } catch (error) {
    return handleError(error, 'Не удалось получить список таблиц');
  }
}