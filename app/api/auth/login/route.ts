import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import db from '@/db/index';
import { eq } from 'drizzle-orm';
import { usersTable } from '@/db/schema';

export async function POST(req: Request) {
    try {
        const { phone, password } = await req.json();
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.phone, phone))
            .execute();

        if (!user) {
            return NextResponse.json({ message: 'Пользователь не найден' }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Неверные учетные данные' }, { status: 400 });
        }

        const token = jwt.sign({ phone, isAdmin: user.isAdmin }, 'your_jwt_secret', { expiresIn: '10h' });
        
        return NextResponse.json({ message: "Успешный вход", token }, { status: 200 });
    } catch (error) {
        console.error("Ошибка в API маршруте: ", error);
        return NextResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
}
