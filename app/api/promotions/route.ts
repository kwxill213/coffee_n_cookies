// app/api/promotions/route.ts
import { NextResponse } from "next/server"
import { promotionsTable } from "@/db/schema"
import db from "@/db"

export async function GET() {
  const promotions = await db.select().from(promotionsTable)
  return NextResponse.json(promotions)
}

export async function POST(request: Request) {
  const data = await request.json()
  const [promotion] = await db.insert(promotionsTable).values(data).returning()
  return NextResponse.json(promotion)
}