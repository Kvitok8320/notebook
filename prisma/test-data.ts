import { PrismaClient, Visibility } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 Creating test data...')

  // 1. Создаем тестового пользователя
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  })
  console.log('✅ Created user:', user)

  // 2. Создаем категорию
  const category = await prisma.category.upsert({
    where: { category: 'Test Category' },
    update: {},
    create: {
      category: 'Test Category',
    },
  })
  console.log('✅ Created category:', category)

  // 3. Создаем тестовый промт
  const prompt = await prisma.prompt.create({
    data: {
      ownerId: user.id,
      title: 'Test Prompt',
      content: 'This is a test prompt content',
      description: 'Test description',
      categoryId: category.id,
      visibility: Visibility.PUBLIC,
      publishedAt: new Date(),
    },
  })
  console.log('✅ Created prompt:', prompt)

  // 4. Создаем голос за промт
  const vote = await prisma.vote.create({
    data: {
      userId: user.id,
      promptId: prompt.id,
      value: 1,
    },
  })
  console.log('✅ Created vote:', vote)

  // 5. Проверяем данные
  const userWithData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      prompts: true,
      votes: true,
    },
  })

  console.log('\n📊 Test data summary:')
  console.log('User:', userWithData?.email)
  console.log('Prompts:', userWithData?.prompts.length)
  console.log('Votes:', userWithData?.votes.length)

  console.log('\n✅ Test data created successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

