# Настройка аутентификации

## Переменные окружения

Добавьте в файл `.env` следующие переменные:

```env
# Auth.js / NextAuth
# Сгенерируйте секретный ключ: openssl rand -base64 32
AUTH_SECRET="your-secret-key-here"

# Google OAuth
# Получите credentials на: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Настройка Google OAuth

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API
4. Перейдите в "Credentials" → "Create Credentials" → "OAuth client ID"
5. Выберите "Web application"
6. Добавьте Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (для разработки)
   - `http://127.0.0.1:3000/api/auth/callback/google` (альтернативный для разработки)
   - `https://yourdomain.com/api/auth/callback/google` (для продакшена)
   
   **ВАЖНО**: 
   - URI должен точно совпадать, включая протокол (http/https), домен и путь
   - Не добавляйте слэш в конце: `/api/auth/callback/google` ✅, `/api/auth/callback/google/` ❌
   - Проверьте, что порт правильный (обычно 3000 для разработки)
   - После добавления URI в Google Cloud Console может потребоваться несколько минут для применения изменений
7. Скопируйте Client ID и Client Secret в `.env`

## Применение изменений схемы

После обновления Prisma схемы выполните:

```bash
npm run db:push
```

Это создаст необходимые таблицы для NextAuth:
- `accounts` - OAuth аккаунты
- `sessions` - сессии пользователей
- `verification_tokens` - токены верификации

## Использование

1. Запустите сервер: `npm run dev`
2. Откройте `/login` для входа через Google
3. После входа вы будете перенаправлены на `/dashboard`
4. Защищенные маршруты:
   - `/dashboard` - панель управления
   - `/my-prompts` - мои промты

## Server-side проверка авторизации

В server components используйте:

```typescript
import { auth } from "@/auth"

export default async function MyComponent() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }
  
  const userId = session.user.id
  // Используйте userId для запросов к БД
}
```

