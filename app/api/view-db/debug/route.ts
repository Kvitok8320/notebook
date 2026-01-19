import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Получаем все ключи из prisma
    const allKeys = Object.keys(prisma)
    
    // Фильтруем модели (они имеют методы findMany, create и т.д.)
    const models = allKeys.filter((key) => {
      const value = (prisma as any)[key]
      return (
        typeof value === 'object' &&
        value !== null &&
        typeof value.findMany === 'function'
      )
    })
    
    // Проверяем доступность каждой модели
    const modelDetails = models.map((modelName) => {
      const model = (prisma as any)[modelName]
      return {
        name: modelName,
        hasFindMany: typeof model.findMany === 'function',
        hasCreate: typeof model.create === 'function',
        hasUpdate: typeof model.update === 'function',
        hasDelete: typeof model.delete === 'function',
      }
    })
    
    return NextResponse.json({
      allKeys,
      models,
      modelDetails,
      prismaType: typeof prisma,
      prismaConstructor: prisma.constructor?.name,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Failed to debug',
        details: error?.message || String(error),
        stack: error?.stack,
      },
      { status: 500 }
    )
  }
}

