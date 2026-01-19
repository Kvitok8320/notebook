import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkTables() {
  try {
    console.log('Проверка таблиц в базе данных...\n')
    
    // Проверяем каждую таблицу
    const tables = [
      { name: 'user', label: 'Users' },
      { name: 'note', label: 'Notes' },
      { name: 'category', label: 'Categories' },
      { name: 'prompt', label: 'Prompts' },
      { name: 'tag', label: 'Tags' },
      { name: 'vote', label: 'Votes' },
    ]
    
    for (const table of tables) {
      try {
        const model = (prisma as any)[table.name]
        if (model) {
          const count = await model.count()
          console.log(`✅ ${table.label} (${table.name}): ${count} записей`)
        } else {
          console.log(`❌ Модель ${table.name} не найдена`)
        }
      } catch (error: any) {
        console.log(`❌ ${table.label}: ${error.message}`)
      }
    }
    
    console.log('\n✅ Проверка завершена!')
    await prisma.$disconnect()
  } catch (error: any) {
    console.error('❌ Ошибка:', error.message)
    await prisma.$disconnect()
    process.exit(1)
  }
}

checkTables()

