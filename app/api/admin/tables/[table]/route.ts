// app/api/admin/tables/[table]/route.ts
import { NextResponse } from 'next/server';
import db from '@/db';
import { 
  usersTable,
  statusTable,
  categoryTable,
  productsTable,
  cartTable,
  cartItemsTable,
  ordersTable,
  orderItemsTable,
  reviewTable,
  restaurantsTable,
  promotionsTable
} from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

const tableMap: Record<string, any> = {
  'Users': usersTable,
  'Status': statusTable,
  'Category': categoryTable,
  'Products': productsTable,
  'Cart': cartTable,
  'Cart_Items': cartItemsTable,
  'Orders': ordersTable,
  'Order_Items': orderItemsTable,
  'Reviews': reviewTable,
  'Restaraunts': restaurantsTable,
  'Promotions': promotionsTable
};

export async function GET(
  request: Request,
  context: { params: Promise<{ table: string }> }
) {
  try {
    const { table } = await context.params;
    const tableSchema = tableMap[table];
    
    if (!tableSchema) {
      return NextResponse.json(
        { error: 'Таблица не найдена' },
        { status: 404 }
      );
    }

    const data = await db.select().from(tableSchema);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return NextResponse.json(
      { error: 'Не удалось получить данные таблицы', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { table: string } }
) {
  try {
    const { table } = params;
    const tableSchema = tableMap[table];
    const body = await request.json();
    console.log(body);
    
    if (!tableSchema) {
      return NextResponse.json(
        { error: 'Таблица не найдена' },
        { status: 404 }
      );
    }

    // Проверяем наличие обязательных полей
    if (!body) {
      return NextResponse.json(
        { error: 'Необходимо передать данные для создания' },
        { status: 400 }
      );
    }

    // Используем транзакцию для надежности
    const result = await db.transaction(async (tx) => {
      // Вставляем данные (исключаем id, если он есть, так как это автоинкрементное поле)
      const { id, ...dataToInsert } = body;
      await tx.insert(tableSchema).values(dataToInsert);
      
      // Получаем последнюю вставленную запись
      const [inserted] = await tx.select()
        .from(tableSchema)
        .orderBy(desc(tableSchema.id)) // Используем desc для получения последней записи
        .limit(1);
      
      return inserted;
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Ошибка при создании записи:', error);
    return NextResponse.json(
      { error: 'Не удалось создать запись', details: String(error) },
      { status: 500 }
    );
  }
}