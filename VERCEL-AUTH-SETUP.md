# Настройка аутентификации для Vercel

## Проблема: redirect_uri_mismatch на Vercel

Если вы видите ошибку "Доступ заблокирован: недопустимый запрос" на Vercel, это означает, что в Google Cloud Console не добавлен правильный redirect URI для вашего домена Vercel.

## Решение

### 1. Узнайте URL вашего проекта на Vercel

После деплоя на Vercel ваш проект будет доступен по адресу:
```
https://your-project-name.vercel.app
```

Или если вы используете кастомный домен:
```
https://yourdomain.com
```

### 2. Добавьте redirect URI в Google Cloud Console

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Выберите ваш проект
3. Найдите ваш OAuth 2.0 Client ID
4. Нажмите "Edit" (редактировать)
5. В разделе "Authorized redirect URIs" добавьте:
   ```
   https://your-project-name.vercel.app/api/auth/callback/google
   ```
   Или для кастомного домена:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
6. Нажмите "Save"
7. Подождите 1-2 минуты для применения изменений

### 3. Настройте переменные окружения в Vercel

В настройках проекта Vercel (Settings → Environment Variables) добавьте:

```env
AUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
DATABASE_URL=your-database-url
```

**ВАЖНО**: 
- Используйте тот же `AUTH_SECRET`, что и в локальной разработке
- Используйте тот же `GOOGLE_CLIENT_ID` и `GOOGLE_CLIENT_SECRET`, что и локально
- После добавления переменных окружения перезапустите деплой

### 4. Проверка

После настройки:
1. Убедитесь, что redirect URI добавлен в Google Cloud Console
2. Убедитесь, что все переменные окружения добавлены в Vercel
3. Перезапустите деплой в Vercel (Deployments → ... → Redeploy)
4. Попробуйте войти через Google на вашем сайте Vercel

### 5. Частые ошибки

**Ошибка: redirect_uri_mismatch**
- Проверьте, что URI в Google Cloud Console точно совпадает с URL вашего проекта
- Убедитесь, что используется `https://` (не `http://`)
- Проверьте, что нет лишнего слэша в конце: `/api/auth/callback/google` ✅, `/api/auth/callback/google/` ❌

**Ошибка: Invalid client**
- Проверьте, что `GOOGLE_CLIENT_ID` и `GOOGLE_CLIENT_SECRET` правильно скопированы в Vercel
- Убедитесь, что нет лишних пробелов или символов

**Ошибка: Database connection failed**
- Проверьте, что `DATABASE_URL` правильно настроен в Vercel
- Убедитесь, что используется pooled connection для serverless (с `-pooler` в хосте)

### 6. Рекомендации

- Добавьте оба redirect URI: для локальной разработки и для Vercel
- Используйте разные OAuth credentials для dev и production (опционально, но рекомендуется)
- Регулярно проверяйте, что все переменные окружения актуальны

