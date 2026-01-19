import { PrismaClient, Visibility } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Создание тестовых данных...\n')

  // Очищаем существующие данные (опционально)
  console.log('Очистка существующих данных...')
  await prisma.vote.deleteMany()
  await prisma.prompt.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.note.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Данные очищены\n')

  // 1. Создаем пользователей
  console.log('Создание пользователей...')
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@example.com',
        name: 'Alice Johnson',
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob@example.com',
        name: 'Bob Smith',
      },
    }),
    prisma.user.create({
      data: {
        email: 'charlie@example.com',
        name: 'Charlie Brown',
      },
    }),
  ])
  console.log(`✅ Создано ${users.length} пользователей\n`)

  // 2. Создаем категории
  console.log('Создание категорий...')
  const categories = await Promise.all([
    prisma.category.create({
      data: { category: 'Programming' },
    }),
    prisma.category.create({
      data: { category: 'Design' },
    }),
    prisma.category.create({
      data: { category: 'Marketing' },
    }),
    prisma.category.create({
      data: { category: 'Writing' },
    }),
  ])
  console.log(`✅ Создано ${categories.length} категорий\n`)

  // 3. Создаем заметки
  console.log('Создание заметок...')
  const notes = await Promise.all([
    prisma.note.create({
      data: {
        ownerId: users[0].id,
        title: 'Моя первая заметка',
      },
    }),
    prisma.note.create({
      data: {
        ownerId: users[0].id,
        title: 'Идеи для проекта',
      },
    }),
    prisma.note.create({
      data: {
        ownerId: users[1].id,
        title: 'Список задач',
      },
    }),
    prisma.note.create({
      data: {
        ownerId: users[2].id,
        title: 'Встреча с командой',
      },
    }),
  ])
  console.log(`✅ Создано ${notes.length} заметок\n`)

  // 4. Создаем теги
  console.log('Создание тегов...')
  const tags = await Promise.all([
    prisma.tag.create({
      data: { name: 'javascript' },
    }),
    prisma.tag.create({
      data: { name: 'react' },
    }),
    prisma.tag.create({
      data: { name: 'nextjs' },
    }),
    prisma.tag.create({
      data: { name: 'prisma' },
    }),
    prisma.tag.create({
      data: { name: 'typescript' },
    }),
  ])
  console.log(`✅ Создано ${tags.length} тегов\n`)

  // 5. Создаем промты
  console.log('Создание промтов...')
  const prompts = await Promise.all([
    prisma.prompt.create({
      data: {
        ownerId: users[0].id,
        title: 'Как создать REST API в Next.js?',
        content: 'Подробное руководство по созданию REST API с использованием Next.js API routes...',
        description: 'Узнайте, как создать RESTful API в Next.js',
        categoryId: categories[0].id,
        visibility: Visibility.PUBLIC,
        publishedAt: new Date(),
      },
    }),
    prisma.prompt.create({
      data: {
        ownerId: users[0].id,
        title: 'Лучшие практики TypeScript',
        content: 'Советы и рекомендации по использованию TypeScript в проектах...',
        description: 'Руководство по TypeScript',
        categoryId: categories[0].id,
        visibility: Visibility.PUBLIC,
        publishedAt: new Date(),
      },
    }),
    prisma.prompt.create({
      data: {
        ownerId: users[1].id,
        title: 'Дизайн пользовательского интерфейса',
        content: 'Принципы и методы создания удобных интерфейсов...',
        description: 'Основы UI/UX дизайна',
        categoryId: categories[1].id,
        visibility: Visibility.PUBLIC,
        publishedAt: new Date(),
      },
    }),
    prisma.prompt.create({
      data: {
        ownerId: users[1].id,
        title: 'Приватный промт',
        content: 'Этот промт виден только владельцу',
        description: 'Приватная заметка',
        categoryId: categories[0].id,
        visibility: Visibility.PRIVATE,
      },
    }),
    prisma.prompt.create({
      data: {
        ownerId: users[2].id,
        title: 'Стратегия контент-маркетинга',
        content: 'Как создать эффективную стратегию контент-маркетинга...',
        description: 'Маркетинговые советы',
        categoryId: categories[2].id,
        visibility: Visibility.PUBLIC,
        publishedAt: new Date(),
      },
    }),
  ])
  console.log(`✅ Создано ${prompts.length} промтов\n`)

  // 6. Создаем голоса
  console.log('Создание голосов...')
  const votes = await Promise.all([
    prisma.vote.create({
      data: {
        userId: users[1].id,
        promptId: prompts[0].id,
        value: 1,
      },
    }),
    prisma.vote.create({
      data: {
        userId: users[2].id,
        promptId: prompts[0].id,
        value: 1,
      },
    }),
    prisma.vote.create({
      data: {
        userId: users[0].id,
        promptId: prompts[2].id,
        value: 1,
      },
    }),
    prisma.vote.create({
      data: {
        userId: users[2].id,
        promptId: prompts[2].id,
        value: 1,
      },
    }),
    prisma.vote.create({
      data: {
        userId: users[1].id,
        promptId: prompts[4].id,
        value: 1,
      },
    }),
  ])
  console.log(`✅ Создано ${votes.length} голосов\n`)

  // Итоговая статистика
  console.log('📊 Итоговая статистика:')
  console.log(`   Пользователи: ${users.length}`)
  console.log(`   Категории: ${categories.length}`)
  console.log(`   Заметки: ${notes.length}`)
  console.log(`   Теги: ${tags.length}`)
  console.log(`   Промты: ${prompts.length}`)
  console.log(`   Голоса: ${votes.length}`)
  console.log('\n✅ Все тестовые данные созданы успешно!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Ошибка:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

