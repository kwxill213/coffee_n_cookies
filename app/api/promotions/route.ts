import { NextResponse } from 'next/server'
import { promotionsTable } from '@/db/schema'
import db from '@/db'

export async function GET() {
  try {
    const promotions = await db.select().from(promotionsTable)
    return NextResponse.json(promotions)
  } catch (error) {
    console.error('Error fetching promotions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const [promotion] = await db.insert(promotionsTable)
      .values({
        ...data,
        start_date: data.start_date ? new Date(data.start_date) : null,
        end_date: data.end_date ? new Date(data.end_date) : null
      })
      .$returningId()

    return NextResponse.json(promotion, { status: 201 })
  } catch (error) {
    console.error('Error creating promotion:', error)
    return NextResponse.json(
      { error: 'Failed to create promotion' },
      { status: 500 }
    )
  }
}