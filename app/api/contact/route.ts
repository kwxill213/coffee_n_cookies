import db from '@/db';
import { contactMessagesTable } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Простая валидация
    if (!body.name || body.name.length < 2) {
      return NextResponse.json(
        { error: 'Имя должно содержать минимум 2 символа' },
        { status: 400 }
      );
    }
    
    if (!body.email || !/^\S+@\S+\.\S+$/.test(body.email)) {
      return NextResponse.json(
        { error: 'Неверный формат email' },
        { status: 400 }
      );
    }
    
    if (!body.message || body.message.length < 10) {
      return NextResponse.json(
        { error: 'Сообщение должно содержать минимум 10 символов' },
        { status: 400 }
      );
    }

    // Сохраняем сообщение в базу данных
    await db.insert(contactMessagesTable).values({
      name: body.name,
      email: body.email,
      message: body.message,
    });

    return NextResponse.json(
      { message: 'Ваше сообщение успешно отправлено!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при обработке формы:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при отправке сообщения' },
      { status: 500 }
    );
  }
}