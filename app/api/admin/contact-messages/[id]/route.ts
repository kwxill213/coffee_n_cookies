import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import db from '@/db'
import { contactMessagesTable } from '@/db/schema'

export async function PATCH(
  request: Request,
 context: { params: Promise<{id: string}>}){
  try {
    const id = parseInt((await context.params).id)
    const { is_processed } = await request.json() 
       
    await db
      .update(contactMessagesTable)
      .set({ is_processed })
      .where(eq(contactMessagesTable.id, Number(id)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    )
  }
}