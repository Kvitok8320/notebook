# Исправление блокировки доступа на Vercel

## Быстрая проверка

### 1. Проверьте переменные окружения в Vercel

В Vercel Dashboard → Settings → Environment Variables должны быть:

```
AUTH_SECRET=ваш-секретный-ключ
GOOGLE_CLIENT_ID=ваш-google-client-id
GOOGLE_CLIENT_SECRET=ваш-google-client-secret
DATABASE_URL=ваша-строка-подключения
```

**ВАЖНО:**
- Все переменные должны быть установлены
- `AUTH_SECRET` должен быть тем же, что и локально
- После добавления/изменения переменных → перезапустите деплой

### 2. Проверьте Redirect URI в Google Cloud Console

1. Откройте [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Найдите ваш OAuth 2.0 Client ID
3. Нажмите "Edit"
4. В "Authorized redirect URIs" должно быть:
   ```
   https://notebook-git-main-ipkvitovs-projects.vercel.app/api/auth/callback/google
   ```
   (замените на ваш реальный URL)

5. **Проверьте точное совпадение:**
   - ✅ `https://` (не `http://`)
   - ✅ Точный домен (без лишних символов)
   - ✅ Путь `/api/auth/callback/google` (без слэша в конце)
   - ✅ Нет пробелов

6. Сохраните и подождите 1-2 минуты

### 3. Проверьте таблицы в базе данных

Убедитесь, что таблицы созданы:
- `users`
- `accounts`
- `sessions`
- `verification_tokens`

Если таблиц нет, выполните локально:
```bash
npx prisma db push
```

### 4. Проверьте логи в Vercel

1. Vercel Dashboard → Deployments → ваш деплой
2. Откройте "Functions" или "Logs"
3. Ищите ошибки:
   - `AUTH_SECRET is not defined`
   - `Database connection failed`
   - `redirect_uri_mismatch`
   - `Invalid client`

### 5. Очистите cookies и попробуйте снова

1. Откройте DevTools (F12)
2. Application → Cookies
3. Удалите все cookies для вашего домена Vercel
4. Попробуйте войти снова

## Частые проблемы и решения

### Проблема: "Доступ заблокирован: недопустимый запрос"

**Причина:** Redirect URI не настроен или не совпадает

**Решение:**
1. Скопируйте точный URL вашего проекта из Vercel
2. Добавьте `/api/auth/callback/google` в конец
3. Добавьте этот URI в Google Cloud Console
4. Подождите 1-2 минуты
5. Попробуйте снова

### Проблема: Редирект на логин после входа

**Причина:** Сессия не сохраняется или не читается

**Решение:**
1. Проверьте, что `AUTH_SECRET` установлен в Vercel
2. Проверьте, что таблицы `sessions` и `accounts` созданы
3. Проверьте логи в Vercel на наличие ошибок БД
4. Убедитесь, что `DATABASE_URL` правильный

### Проблема: "Invalid client"

**Причина:** Неправильные `GOOGLE_CLIENT_ID` или `GOOGLE_CLIENT_SECRET`

**Решение:**
1. Проверьте, что значения скопированы правильно
2. Убедитесь, что нет лишних пробелов
3. Проверьте, что используются правильные credentials для продакшена

## Пошаговая инструкция

1. ✅ Проверьте переменные окружения в Vercel
2. ✅ Добавьте redirect URI в Google Cloud Console
3. ✅ Убедитесь, что таблицы созданы в БД
4. ✅ Перезапустите деплой в Vercel
5. ✅ Очистите cookies в браузере
6. ✅ Попробуйте войти снова

## Если ничего не помогает

1. Проверьте логи в Vercel Dashboard
2. Проверьте логи в Google Cloud Console (если доступны)
3. Попробуйте создать новый OAuth client в Google Cloud Console
4. Убедитесь, что используете правильный проект в Google Cloud Console

