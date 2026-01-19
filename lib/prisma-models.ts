import { prisma } from './prisma'

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

export function getPrismaModel(tableName: string) {
  const model = prismaModels[tableName as TableName]
  if (!model) {
    throw new Error(`Table "${tableName}" not found in prismaModels mapping`)
  }
  return model
}

