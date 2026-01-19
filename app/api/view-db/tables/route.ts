import { NextResponse } from 'next/server'
import { DB_TABLES } from '@/lib/db-tables'

export async function GET() {
  try {
    return NextResponse.json({ tables: DB_TABLES })
  } catch (error) {
    console.error('Error fetching tables:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tables' },
      { status: 500 }
    )
  }
}

