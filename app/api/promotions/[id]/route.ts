// app/api/promotions/[id]/route.ts
import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import db from "@/db"
import { promotionsTable } from "@/db/schema"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const [promotion] = await db.select()
    .from(promotionsTable)
    .where(eq(promotionsTable.id, Number(params.id)))
  return NextResponse.json(promotion)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json()
  const [promotion] = await db.update(promotionsTable)
    .set(data)
    .where(eq(promotionsTable.id, Number(params.id)))
    .returning()
  return NextResponse.json(promotion)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await db.delete(promotionsTable)
    .where(eq(promotionsTable.id, Number(params.id)))
  return NextResponse.json({ success: true })
}