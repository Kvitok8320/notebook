import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function check() {
  const counts = {
    users: await prisma.user.count(),
    notes: await prisma.note.count(),
    categories: await prisma.category.count(),
    prompts: await prisma.prompt.count(),
    tags: await prisma.tag.count(),
    votes: await prisma.vote.count(),
  }
  
  console.log('📊 Количество записей в таблицах:')
  console.log(counts)
  
  await prisma.$disconnect()
}

check().catch(console.error)


