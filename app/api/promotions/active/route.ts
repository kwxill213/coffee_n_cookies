// app/api/promotions/active/route.ts
import { NextResponse } from "next/server"
import db from "@/db"
import { promotionsTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    // Получаем только активные акции без учета дат
    const promotions = await db.select()
      .from(promotionsTable)
      .where(eq(promotionsTable.is_active, true))

    return NextResponse.json(promotions)
  } catch (error) {
    console.error('Error fetching active promotions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch active promotions' },
      { status: 500 }
    )
  }
}