# Деплой на Vercel

## Переменные окружения

Убедитесь, что в настройках проекта Vercel добавлены все необходимые переменные:

1. **DATABASE_URL** - строка подключения к NeonDB
2. **AUTH_SECRET** - секретный ключ (сгенерируйте: `openssl rand -base64 32`)
3. **GOOGLE_CLIENT_ID** - Client ID из Google Cloud Console
4. **GOOGLE_CLIENT_SECRET** - Client Secret из Google Cloud Console

## Настройка в Vercel

1. Перейдите в Settings → Environment Variables
2. Добавьте все переменные для Production, Preview и Development
3. Убедитесь, что переменные применены

## Настройка Google OAuth Redirect URI

В Google Cloud Console добавьте:
- Production: `https://your-domain.vercel.app/api/auth/callback/google`
- Preview: `https://your-preview-url.vercel.app/api/auth/callback/google`

## Применение схемы базы данных

После первого деплоя выполните миграцию:

```bash
# Через Vercel CLI
vercel env pull
npx prisma db push

# Или через Neon Console
# Выполните SQL миграции вручную
```

## Проверка сборки

Если сборка падает:
1. Проверьте логи сборки в Vercel
2. Убедитесь, что все переменные окружения заданы
3. Проверьте, что Prisma Client сгенерирован (`prisma generate`)

## Troubleshooting

### Ошибка "Module not found"
- Убедитесь, что все зависимости в `package.json`
- Проверьте, что `postinstall` скрипт выполняется

### Ошибка "AUTH_SECRET is not set"
- Добавьте переменную `AUTH_SECRET` в Vercel
- Пересоберите проект

### Ошибка подключения к БД
- Проверьте `DATABASE_URL` в Vercel
- Убедитесь, что используется правильный connection string (не pooler для миграций)

