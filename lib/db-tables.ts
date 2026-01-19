// Список таблиц из Prisma схемы
export const DB_TABLES = [
  { name: 'users', label: 'Users', model: 'user' },
  { name: 'notes', label: 'Notes', model: 'note' },
  { name: 'categories', label: 'Categories', model: 'category' },
  { name: 'prompts', label: 'Prompts', model: 'prompt' },
  { name: 'tags', label: 'Tags', model: 'tag' },
  { name: 'votes', label: 'Votes', model: 'vote' },
] as const

export type TableName = typeof DB_TABLES[number]['name']
export type ModelName = typeof DB_TABLES[number]['model']

