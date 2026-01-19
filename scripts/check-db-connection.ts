import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkConnection() {
  try {
    console.log('Проверка подключения к базе данных...\n')
    
    // Пробуем простой запрос
    const userCount = await prisma.user.count()
    console.log(`✅ Подключение успешно!`)
    console.log(`Количество пользователей: ${userCount}`)
    
    // Получаем список таблиц через raw query
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `
    
    console.log(`\n📊 Таблицы в базе данных (${tables.length}):`)
    tables.forEach(table => {
      console.log(`  - ${table.tablename}`)
    })
    
    await prisma.$disconnect()
  } catch (error: any) {
    console.error('❌ Ошибка подключения:', error.message)
    if (error.message.includes('P1001')) {
      console.error('Не удается подключиться к базе данных. Проверьте DATABASE_URL в .env файле.')
    }
    await prisma.$disconnect()
    process.exit(1)
  }
}

checkConnection()

