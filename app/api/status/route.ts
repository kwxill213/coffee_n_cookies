import { NextResponse } from 'next/server';
import db from '@/db';
import { statusTable } from '@/db/schema';

export async function GET() {
  try {
    const statuses = await db.select().from(statusTable);
    return NextResponse.json(statuses);
  } catch (error) {
    console.error('Ошибка при получении статусов:', error);
    return NextResponse.json(
      { error: 'Не удалось получить статусы' },
      { status: 500 }
    );
  }
}