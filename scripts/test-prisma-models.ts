import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function test() {
  console.log('Testing Prisma Client models...\n')
  
  // Проверяем все ключи
  const allKeys = Object.keys(prisma)
  console.log('All keys in prisma:', allKeys)
  console.log('')
  
  // Проверяем модели
  const models = ['user', 'note', 'category', 'prompt', 'tag', 'vote']
  
  for (const modelName of models) {
    const model = (prisma as any)[modelName]
    if (model && typeof model.findMany === 'function') {
      console.log(`✅ ${modelName} - доступна`)
      try {
        const count = await model.count()
        console.log(`   Количество записей: ${count}`)
      } catch (e: any) {
        console.log(`   Ошибка при подсчете: ${e.message}`)
      }
    } else {
      console.log(`❌ ${modelName} - НЕ доступна`)
      if (model) {
        console.log(`   Тип: ${typeof model}`)
        console.log(`   Методы: ${Object.keys(model).slice(0, 5).join(', ')}`)
      }
    }
  }
  
  await prisma.$disconnect()
}

test().catch(console.error)

