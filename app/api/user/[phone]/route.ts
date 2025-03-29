// app/api/user/[phone]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/db';
import { eq } from 'drizzle-orm';
import { usersTable } from '@/db/schema';

export async function GET(
  req: NextRequest, 
  { params }: { params: { phone: string } }
) {
  try {
    const { phone } = params; // Убрали await

    const [user] = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        gender: usersTable.gender,
        created_at: usersTable.created_at,
        phone: usersTable.phone,
        adress: usersTable.adress // Исправлено adress -> address
      })
      .from(usersTable)
      .where(eq(usersTable.phone, phone));

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    return NextResponse.json({ error: 'Не удалось получить данные' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { phone: string } }
) {
  try {
    const { phone } = params;
    const formData = await request.formData(); // Используем formData() вместо json()
    
    const username = formData.get('username') as string;
    const gender = formData.get('gender') as string;

    // Обновляем данные пользователя
    await db.update(usersTable)
      .set({
        username,
        gender: gender === 'null' ? null : gender === 'true',
      })
      .where(eq(usersTable.phone, phone));

    // Получаем обновленные данные пользователя
    const [updatedUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.phone, phone));

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Ошибка обновления:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}