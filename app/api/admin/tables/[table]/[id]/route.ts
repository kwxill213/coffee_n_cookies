// app/api/admin/tables/[table]/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
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
  restarauntsTable
} from '@/db/schema';
import { eq } from 'drizzle-orm';

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
  'Restaraunts': restarauntsTable
};

export async function GET(
  request: Request,
  { params }: { params: { table: string, id: string } }
) {
  try {
    const { table: tableName, id } = params;
    const table = tableMap[tableName];
    
    if (!table) {
      return NextResponse.json(
        { error: 'Таблица не найдена' },
        { status: 404 }
      );
    }

    const [data] = await db.select().from(table).where(eq(table.id, parseInt(id)));
    
    if (!data) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Не удалось получить запись' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context:  { params: Promise<{ table: string, id: string }> }
) {
  try {
    const { table: tableName, id } = await context.params;
    const table = tableMap[tableName];
    const body = await request.json();

    if (!table) {
      return NextResponse.json(
        { error: 'Таблица не найдена' },
        { status: 404 }
      );
    }

    // Преобразуем ID в число
    const recordId = Number(id);
    if (isNaN(recordId)) {
      return NextResponse.json(
        { error: 'Неверный ID записи' },
        { status: 400 }
      );
    }

    // Удаляем неизменяемые поля
    const { id: _, created_at, ...updateData } = body;

    // 1. Проверяем существование записи
    const [existing] = await db.select()
      .from(table)
      .where(eq(table.id, recordId));

    if (!existing) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
      );
    }

    // 2. Выполняем обновление
    await db.update(table)
      .set(updateData)
      .where(eq(table.id, recordId));

    // 3. Получаем обновлённую запись
    const [updated] = await db.select()
      .from(table)
      .where(eq(table.id, recordId));

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      {
        error: 'Не удалось обновить запись',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { table: string, id: string } }
) {
  try {
    const { table: tableName, id } = params;
    const table = tableMap[tableName];

    if (!table) {
      return NextResponse.json(
        { error: 'Таблица не найдена' },
        { status: 404 }
      );
    }

    // Сначала получаем запись, которую будем удалять
    const [toDelete] = await db.select()
      .from(table)
      .where(eq(table.id, parseInt(id)));

    if (!toDelete) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
      );
    }

    // Удаляем запись
    await db.delete(table)
      .where(eq(table.id, parseInt(id)));

    return NextResponse.json({ data: toDelete });
  } catch (error) {
    return NextResponse.json(
      { error: 'Не удалось удалить запись', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}