import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const userEmail = 'kvitok8320@gmail.com'
  
  console.log(`Поиск пользователя ${userEmail}...`)
  
  // Сначала проверим всех пользователей
  const allUsers = await prisma.user.findMany({
    select: { id: true, email: true, name: true }
  })
  console.log(`Найдено пользователей в БД: ${allUsers.length}`)
  allUsers.forEach(u => {
    console.log(`  - ${u.email} (${u.name || 'без имени'})`)
  })
  
  // Находим пользователя
  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  })
  
  if (!user) {
    console.error(`\n❌ Пользователь с email ${userEmail} не найден!`)
    console.error(`\nДоступные пользователи:`)
    allUsers.forEach(u => console.error(`  - ${u.email}`))
    process.exit(1)
  }
  
  console.log(`Пользователь найден: ${user.name || user.email} (ID: ${user.id})`)
  
  // Находим или создаем категорию "General"
  let category = await prisma.category.findFirst({
    where: { category: "General" }
  })
  
  if (!category) {
    category = await prisma.category.create({
      data: { category: "General" }
    })
    console.log(`Создана категория: ${category.category}`)
  } else {
    console.log(`Используется категория: ${category.category}`)
  }
  
  // Создаем 3 промта
  const prompts = [
    {
      title: "Анализ технического задания",
      description: "Помощь в структурировании и анализе технических требований",
      content: `Проанализируй следующее техническое задание и выдели:

1. **Основные цели проекта**
   - Бизнес-цели
   - Пользовательские цели

2. **Функциональные требования**
   - Ключевые функции
   - Приоритеты

3. **Технические требования**
   - Платформа
   - Ограничения

4. **Риски и проблемы**
   - Потенциальные сложности
   - Предложения по решению

Техническое задание:
[Вставьте текст ТЗ здесь]`,
      isPublic: false,
      isFavorite: false,
    },
    {
      title: "Генерация идеи для проекта",
      description: "Структурированный подход к генерации идей",
      content: `Помоги разработать идею для проекта в области [указать область].

Проведи анализ по следующим пунктам:

1. **Проблема**
   - Какую проблему решает проект?
   - Кто сталкивается с этой проблемой?

2. **Решение**
   - Основная идея решения
   - Уникальные преимущества

3. **Целевая аудитория**
   - Кто будет использовать продукт?
   - Потребности аудитории

4. **Монетизация**
   - Возможные модели дохода
   - Оценка потенциала

5. **Конкуренты**
   - Аналоги на рынке
   - Отличия от конкурентов`,
      isPublic: true,
      isFavorite: true,
    },
    {
      title: "Код-ревью и оптимизация",
      description: "Чек-лист для проверки качества кода",
      content: `Проведи код-ревью следующего кода:

**Чек-лист для проверки:**

1. **Читаемость кода**
   - Понятны ли имена переменных и функций?
   - Есть ли комментарии там, где нужно?
   - Следует ли код стандартам проекта?

2. **Производительность**
   - Есть ли узкие места?
   - Можно ли оптимизировать алгоритмы?
   - Правильно ли используются ресурсы?

3. **Безопасность**
   - Есть ли уязвимости?
   - Правильно ли обрабатываются данные?
   - Есть ли валидация входных данных?

4. **Архитектура**
   - Правильное разделение ответственности?
   - Нет ли дублирования кода?
   - Соответствует ли принципам SOLID?

**Код для проверки:**
\`\`\`
[Вставьте код здесь]
\`\`\`

Предложи конкретные улучшения с примерами кода.`,
      isPublic: false,
      isFavorite: false,
    },
  ]
  
  console.log(`\nСоздание ${prompts.length} промтов...`)
  
  for (const promptData of prompts) {
    const prompt = await prisma.prompt.create({
      data: {
        ownerId: user.id,
        categoryId: category.id,
        ...promptData,
      },
    })
    console.log(`✓ Создан промт: "${prompt.title}" (ID: ${prompt.id})`)
  }
  
  console.log(`\n✅ Успешно создано ${prompts.length} промтов для пользователя ${userEmail}`)
}

main()
  .catch((e) => {
    console.error('Ошибка:', e)
    console.error('Stack:', e.stack)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
  .then(() => {
    console.log('\nЗавершение работы скрипта...')
    process.exit(0)
  })

