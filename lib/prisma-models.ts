import { prisma } from './prisma'
import type { Prisma } from '@prisma/client'

// Маппинг имен таблиц на модели Prisma
// Используем прямой доступ к моделям через типизированный интерфейс
export const prismaModels = {
  users: prisma.user,
  notes: prisma.note,
  categories: prisma.category,
  prompts: prisma.prompt,
  tags: prisma.tag,
  votes: prisma.vote,
} as const

export type TableName = keyof typeof prismaModels

// Тип для модели Prisma с методами findMany, count, create, update, delete
type PrismaModel = {
  findMany: (args?: any) => Promise<any[]>
  count: (args?: any) => Promise<number>
  create: (args: any) => Promise<any>
  update: (args: any) => Promise<any>
  delete: (args: any) => Promise<any>
}

export function getPrismaModel(tableName: string): PrismaModel {
  const model = prismaModels[tableName as TableName]
  if (!model) {
    throw new Error(`Table "${tableName}" not found in prismaModels mapping`)
  }
  return model as PrismaModel
}

