import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const note1 = await prisma.note.create({
    data: {
      title: 'Welcome to Notebook',
    },
  })

  const note2 = await prisma.note.create({
    data: {
      title: 'This is a sample note',
    },
  })

  const note3 = await prisma.note.create({
    data: {
      title: 'Database is working!',
    },
  })

  console.log('Created notes:', { note1, note2, note3 })
  console.log('Seeding finished!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

