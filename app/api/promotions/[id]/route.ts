// app\api\promotions\[id]\route.ts
import { NextResponse } from 'next/server'
import { promotionsTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import db from '@/db'
export async function GET(request: Request, context: { params: Promise<{id: string}>}){
  try {
    const id = parseInt((await context.params).id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid promotion ID' },
        { status: 400 }
      )
    }

    const promotion = await db
      .select()
      .from(promotionsTable)
      .where(eq(promotionsTable.id, id))
      .limit(1)

    if (!promotion.length) {
      return NextResponse.json(
        { error: 'Promotion not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(promotion[0])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch promotion' },
      { status: 500 }
    )
  }
}

// PUT
export async function PUT(request: Request, context: { params: Promise<{id: string}>}){
  try {
    const id = parseInt((await context.params).id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid promotion ID' },
        { status: 400 }
      )
    }

    const rawData = await request.json()


    const data = {
      ...rawData
    }

    const promotion = await db
      .update(promotionsTable)
      .set(data)
      .where(eq(promotionsTable.id, id))

    if (!promotion) {
      return NextResponse.json(
        { error: 'Promotion not found' },
        { status: 404 }
      )
    }
    console.log("3");

    return NextResponse.json(promotion)
  } catch (error) {
    console.error('Error updating promotion:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update promotion',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}


// DELETE
export async function DELETE(request: Request, context: { params: Promise<{id: string}> }) {
  try {
    const id = parseInt((await context.params).id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid promotion ID' }, { status: 400 });
    }

    // Получаем данные для возврата после удаления
    const promotionToDelete = await db
      .select()
      .from(promotionsTable)
      .where(eq(promotionsTable.id, id))
      .limit(1);

    if (!promotionToDelete.length) {
      return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
    }

    await db
      .delete(promotionsTable)
      .where(eq(promotionsTable.id, id));

    return NextResponse.json(promotionToDelete[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete promotion' }, { status: 500 });
  }
}
