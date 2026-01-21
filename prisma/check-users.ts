import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Проверка пользователей в БД...\n')
  
  const users = await prisma.user.findMany({
    include: {
      accounts: {
        select: {
          provider: true,
          providerAccountId: true,
          type: true,
        }
      },
      prompts: {
        select: {
          id: true,
          title: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  console.log(`Найдено пользователей: ${users.length}\n`)
  
  users.forEach((user, index) => {
    console.log(`${index + 1}. Пользователь:`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Имя: ${user.name || '(не указано)'}`)
    console.log(`   Создан: ${user.createdAt.toLocaleString('ru-RU')}`)
    console.log(`   Промтов: ${user.prompts.length}`)
    
    if (user.accounts.length > 0) {
      console.log(`   Аккаунты Google:`)
      user.accounts.forEach(acc => {
        console.log(`     - Provider: ${acc.provider}, Account ID: ${acc.providerAccountId}`)
      })
    } else {
      console.log(`   Аккаунты Google: (нет)`)
    }
    console.log('')
  })
}

main()
  .catch((e) => {
    console.error('Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

