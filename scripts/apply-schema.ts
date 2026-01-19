import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function applySchema() {
  try {
    console.log('Проверка подключения к базе данных...')
    
    // Проверяем подключение
    await prisma.$connect()
    console.log('✅ Подключение успешно!\n')
    
    // Пробуем выполнить простой запрос к каждой таблице
    const tables = ['user', 'note', 'category', 'prompt', 'tag', 'vote']
    
    for (const table of tables) {
      try {
        const model = (prisma as any)[table]
        if (model) {
          const count = await model.count()
          console.log(`✅ Таблица ${table}: ${count} записей`)
        } else {
          console.log(`❌ Модель ${table} не найдена в Prisma Client`)
        }
      } catch (error: any) {
        if (error.message.includes('does not exist')) {
          console.log(`❌ Таблица ${table} не существует в базе данных`)
        } else {
          console.log(`⚠️  Ошибка при проверке ${table}: ${error.message}`)
        }
      }
    }
    
    await prisma.$disconnect()
    console.log('\n💡 Если таблицы не существуют, выполните: npx prisma db push')
  } catch (error: any) {
    console.error('❌ Ошибка:', error.message)
    if (error.message.includes('P1001') || error.message.includes('connect')) {
      console.error('\nПроверьте:')
      console.error('1. Файл .env существует и содержит DATABASE_URL')
      console.error('2. DATABASE_URL правильный и база данных доступна')
      console.error('3. База данных создана в Neon')
    }
    await prisma.$disconnect()
    process.exit(1)
  }
}

applySchema()

