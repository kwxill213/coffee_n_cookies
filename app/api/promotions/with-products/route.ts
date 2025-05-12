// app/api/promotions/with-products/route.ts
import { NextResponse } from 'next/server'
import db from '@/db'
import { promotionsTable, productsTable } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const promotions = await db.select({
      promotion: promotionsTable,
      product: productsTable
    })
    .from(promotionsTable)
    .leftJoin(
      productsTable,
      eq(promotionsTable.product_id, productsTable.id)
    )
    .where(
      eq(promotionsTable.is_active, true)
    )

    const formattedPromotions = promotions.map(row => ({
      ...row.promotion,
      product: row.product
    }))

    return NextResponse.json(formattedPromotions)
  } catch (error) {
    console.error('Error fetching promotions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    )
  }
}