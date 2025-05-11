// app/api/promotions/active/route.ts
import { NextResponse } from "next/server"
import db from "@/db"
import { promotionsTable } from "@/db/schema"
import { and, eq, or, lte, gte, isNull } from "drizzle-orm"

export async function GET() {
  const now = new Date()
  const promotions = await db.select().from(promotionsTable)
    .where(
      and(
        eq(promotionsTable.is_active, true),
        or(
          isNull(promotionsTable.start_date),
          lte(promotionsTable.start_date, now)
        ),
        or(
          isNull(promotionsTable.end_date),
          gte(promotionsTable.end_date, now)
        )
      )
    )
  return NextResponse.json(promotions)
}