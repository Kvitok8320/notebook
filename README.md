# Notebook App

Минимальный рабочий проект на Next.js (App Router) + Prisma + NeonDB (PostgreSQL), готовый к деплою на Vercel.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка базы данных

1. Создайте базу данных в [Neon](https://console.neon.tech)
2. Скопируйте `.env.example` в `.env`:
   ```bash
   cp .env.example .env
   ```
3. Добавьте строку подключения к базе данных в `.env`:
   ```
   DATABASE_URL="postgresql://user:password@host.neon.tech/database?sslmode=require"
   ```

### 3. Настройка Prisma и миграции

```bash
# Применить схему к базе данных
npm run db:push

# Или создать миграцию
npm run db:migrate
```

### 4. Заполнение базы данных (seed)

```bash
npm run db:seed
```

### 5. Запуск проекта

```bash
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен версии
npm start
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 📦 Структура проекта

```
.
├── app/
│   ├── layout.tsx      # Корневой layout
│   ├── page.tsx        # Главная страница с запросом к БД
│   └── globals.css     # Глобальные стили
├── lib/
│   └── prisma.ts       # Prisma Client (синглтон)
├── prisma/
│   ├── schema.prisma   # Схема базы данных
│   └── seed.ts         # Seed скрипт
├── .env.example        # Пример переменных окружения
└── package.json        # Зависимости и скрипты
```

## 🗄️ Модель данных

### Note
- `id` (String, UUID) - уникальный идентификатор
- `title` (String) - заголовок заметки
- `createdAt` (DateTime) - дата создания

## 🚢 Деплой на Vercel

### 1. Подготовка

1. Убедитесь, что все изменения закоммичены в Git
2. Запушите код в GitHub/GitLab/Bitbucket

### 2. Настройка Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Импортируйте ваш репозиторий
3. Добавьте переменную окружения `DATABASE_URL` в настройках проекта:
   - Settings → Environment Variables
   - Добавьте `DATABASE_URL` со значением из Neon

### 3. Деплой

Vercel автоматически:
- Установит зависимости (`npm install`)
- Сгенерирует Prisma Client (`prisma generate` через `postinstall`)
- Соберет проект (`npm run build`)
- Задеплоит приложение

### 4. После деплоя

После первого деплоя выполните миграции и seed (если нужно):

```bash
# Через Vercel CLI или вручную через Neon консоль
npm run db:push
npm run db:seed
```

## 📝 Доступные команды

- `npm run dev` - запуск в режиме разработки
- `npm run build` - сборка для продакшена
- `npm start` - запуск продакшен версии
- `npm run db:push` - применить схему Prisma к БД
- `npm run db:migrate` - создать и применить миграцию
- `npm run db:seed` - заполнить базу тестовыми данными

## 🔧 Технологии

- **Next.js 14** - React фреймворк с App Router
- **TypeScript** - типизация
- **Prisma** - ORM для работы с БД
- **NeonDB** - серверless PostgreSQL
- **Vercel** - платформа для деплоя

## 📄 Лицензия

MIT
