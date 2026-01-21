import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Проверка подключения к базе данных...')
    await prisma.$connect()
    console.log('✅ Подключение успешно!')
    
    // Проверяем, что таблица favorites существует
    const result = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'favorites'
    `
    console.log('Таблица favorites:', result)
    
    // Проверяем количество пользователей
    const userCount = await prisma.user.count()
    console.log(`Пользователей в БД: ${userCount}`)
    
  } catch (error: any) {
    console.error('❌ Ошибка подключения:', error.message)
    if (error.code === 'P1000') {
      console.error('Ошибка аутентификации. Проверьте DATABASE_URL в .env файле.')
    } else if (error.code === 'P1001') {
      console.error('Не удалось подключиться к серверу БД. Проверьте доступность базы данных.')
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()

