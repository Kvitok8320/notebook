import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DB_TABLES } from '@/lib/db-tables'

const ITEMS_PER_PAGE = 10

// Вспомогательная функция для получения модели
function getModel(modelName: string) {
  // Prisma Client использует имена моделей в нижнем регистре
  // Проверяем, что prisma объект существует
  if (!prisma) {
    throw new Error('Prisma Client is not initialized')
  }
  
  const model = (prisma as any)[modelName]
  
  if (!model) {
    // Получаем список доступных моделей для отладки
    const allKeys = Object.keys(prisma)
    const availableModels = allKeys.filter(
      (key) => {
        const value = (prisma as any)[key]
        return (
          typeof value === 'object' && 
          value !== null &&
          typeof value.findMany === 'function'
        )
      }
    )
    
    console.error(`Model "${modelName}" not found in Prisma Client`)
    console.error('All Prisma keys:', allKeys)
    console.error('Available models:', availableModels)
    
    throw new Error(
      `Model "${modelName}" not found. ` +
      `Available models: ${availableModels.join(', ')}. ` +
      `All keys: ${allKeys.join(', ')}`
    )
  }
  
  return model
}

// Получить данные таблицы с пагинацией
export async function GET(
  request: NextRequest,
  { params }: { params: { table: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * ITEMS_PER_PAGE

    const tableInfo = DB_TABLES.find((t) => t.name === params.table)
    if (!tableInfo) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 })
    }

    const model = (prisma as any)[tableInfo.model]
    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 })
    }

    // Получаем данные с пагинацией
    // Пытаемся использовать createdAt для сортировки, если его нет - используем id
    let data, total
    try {
      [data, total] = await Promise.all([
        model.findMany({
          skip,
          take: ITEMS_PER_PAGE,
          orderBy: { createdAt: 'desc' },
        }),
        model.count(),
      ])
    } catch (error) {
      // Если createdAt нет, используем id
      [data, total] = await Promise.all([
        model.findMany({
          skip,
          take: ITEMS_PER_PAGE,
          orderBy: { id: 'desc' },
        }),
        model.count(),
      ])
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        totalPages: Math.ceil(total / ITEMS_PER_PAGE),
        totalItems: total,
        itemsPerPage: ITEMS_PER_PAGE,
      },
    })
  } catch (error: any) {
    console.error('Error fetching table data:', error)
    const errorMessage = error?.message || String(error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch table data', 
        details: errorMessage,
        model: tableInfo?.model,
        table: params.table
      },
      { status: 500 }
    )
  }
}

// Создать новую запись
export async function POST(
  request: NextRequest,
  { params }: { params: { table: string } }
) {
  try {
    const body = await request.json()
    const tableInfo = DB_TABLES.find((t) => t.name === params.table)
    
    if (!tableInfo) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 })
    }

    const model = getModel(tableInfo.model)

    const created = await model.create({ data: body })
    return NextResponse.json({ data: created })
  } catch (error) {
    console.error('Error creating record:', error)
    return NextResponse.json(
      { error: 'Failed to create record', details: String(error) },
      { status: 500 }
    )
  }
}

// Обновить запись
export async function PUT(
  request: NextRequest,
  { params }: { params: { table: string } }
) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const tableInfo = DB_TABLES.find((t) => t.name === params.table)
    if (!tableInfo) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 })
    }

    const model = getModel(tableInfo.model)

    const updated = await model.update({
      where: { id },
      data,
    })
    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error('Error updating record:', error)
    return NextResponse.json(
      { error: 'Failed to update record', details: String(error) },
      { status: 500 }
    )
  }
}

// Удалить запись
export async function DELETE(
  request: NextRequest,
  { params }: { params: { table: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const tableInfo = DB_TABLES.find((t) => t.name === params.table)
    if (!tableInfo) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 })
    }

    const model = getModel(tableInfo.model)

    await model.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting record:', error)
    return NextResponse.json(
      { error: 'Failed to delete record', details: String(error) },
      { status: 500 }
    )
  }
}

