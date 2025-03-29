import db from '@/db/index';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usersTable } from '@/db/schema';

export async function POST(req: Request) {
    try {
        const { phone, username, password } = await req.json(); 

        // Проверка, существует ли пользователь по телефону
        const existingUserByPhone = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.phone, phone))
            .execute();

        if (existingUserByPhone.length > 0) {
            return NextResponse.json({ message: 'Этот номер телефона уже используется' }, { status: 400 });
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Сохранение нового пользователя в базе данных
        await db.insert(usersTable).values({
            phone: phone,
            password: hashedPassword,
            username: username,
        });



        return NextResponse.json({ message: 'Пользователь зарегистрирован' }, { status: 200 });
        
        
    } catch (error) {
        console.error("Ошибка в API маршруте: ", error);
        return NextResponse.json({ message: 'Внутренняя ошибка сервера', success: false }, { status: 500 });
    }
}
