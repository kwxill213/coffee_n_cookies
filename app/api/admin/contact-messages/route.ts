import { NextResponse } from 'next/server'
import { desc } from 'drizzle-orm'
import db from '@/db'
import { contactMessagesTable } from '@/db/schema'

export async function GET() {
  try {
    const messages = await db
      .select()
      .from(contactMessagesTable)
      .orderBy(desc(contactMessagesTable.created_at))

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}