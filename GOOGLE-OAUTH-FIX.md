# Исправление ошибки redirect_uri_mismatch

## Ошибка: "Ошибка 400: redirect_uri_mismatch"

Эта ошибка означает, что redirect URI, который использует ваше приложение, не совпадает с тем, что настроено в Google Cloud Console.

## Пошаговое решение:

### Шаг 1: Узнайте точный URL вашего проекта на Vercel

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите ваш проект `notebook`
3. Скопируйте URL из раздела "Domains" или из адресной строки после деплоя
4. URL будет выглядеть примерно так:
   ```
   https://notebook-git-main-ipkvitovs-projects.vercel.app
   ```
   или
   ```
   https://notebook-xxxxx.vercel.app
   ```

### Шаг 2: Добавьте Redirect URI в Google Cloud Console

1. Откройте [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Убедитесь, что выбран правильный проект (тот же, где создан OAuth client)
3. В левом меню: **APIs & Services** → **Credentials**
4. Найдите ваш **OAuth 2.0 Client ID** (тип "Web application")
5. Нажмите на иконку карандаша (Edit) справа от Client ID

### Шаг 3: Добавьте Authorized redirect URIs

В разделе **"Authorized redirect URIs"** добавьте:

```
https://ваш-точный-url-из-vercel/api/auth/callback/google
```

**Пример:**
```
https://notebook-git-main-ipkvitovs-projects.vercel.app/api/auth/callback/google
```

### Шаг 4: КРИТИЧЕСКИ ВАЖНО - Проверьте точное совпадение

Redirect URI должен **ТОЧНО** совпадать:

✅ **Правильно:**
- `https://notebook-git-main-ipkvitovs-projects.vercel.app/api/auth/callback/google`
- Используется `https://` (не `http://`)
- Нет слэша в конце
- Нет пробелов
- Правильный путь: `/api/auth/callback/google`

❌ **Неправильно:**
- `http://notebook...` (используется http вместо https)
- `https://notebook.../api/auth/callback/google/` (лишний слэш в конце)
- `https://notebook.../api/auth/callback/Google` (заглавная буква)
- `https://notebook.../api/auth/callback/google ` (пробел в конце)

### Шаг 5: Сохраните и подождите

1. Нажмите **"Save"** внизу страницы
2. **Подождите 1-2 минуты** - изменения в Google Cloud Console применяются не мгновенно
3. Не закрывайте страницу сразу после сохранения

### Шаг 6: Проверьте все Redirect URIs

Убедитесь, что у вас добавлены ОБА redirect URI:

1. **Для локальной разработки:**
   ```
   http://localhost:3000/api/auth/callback/google
   ```

2. **Для Vercel (продакшен):**
   ```
   https://ваш-точный-url-из-vercel/api/auth/callback/google
   ```

Можно добавить несколько URI - они должны быть на разных строках.

### Шаг 7: Проверьте переменные окружения в Vercel

В Vercel Dashboard → Settings → Environment Variables:

```
GOOGLE_CLIENT_ID=ваш-client-id
GOOGLE_CLIENT_SECRET=ваш-client-secret
AUTH_SECRET=ваш-secret-key
DATABASE_URL=ваша-строка-подключения
```

**ВАЖНО:** Используйте те же `GOOGLE_CLIENT_ID` и `GOOGLE_CLIENT_SECRET`, что и локально.

### Шаг 8: Перезапустите деплой и попробуйте снова

1. В Vercel Dashboard → Deployments
2. Найдите последний деплой
3. Нажмите "..." → **"Redeploy"**
4. Дождитесь завершения деплоя
5. Очистите cookies в браузере
6. Попробуйте войти через Google снова

## Если ошибка сохраняется:

### Проверка 1: Убедитесь, что используете правильный OAuth Client

1. В Google Cloud Console проверьте, что вы редактируете правильный OAuth 2.0 Client ID
2. Убедитесь, что `GOOGLE_CLIENT_ID` в Vercel совпадает с Client ID в Google Cloud Console

### Проверка 2: Проверьте точный URL в браузере

1. Откройте ваш сайт на Vercel
2. Скопируйте точный URL из адресной строки
3. Добавьте `/api/auth/callback/google` в конец
4. Этот полный URL должен быть в Google Cloud Console

### Проверка 3: Попробуйте в режиме инкогнито

1. Откройте браузер в режиме инкогнито
2. Попробуйте войти через Google
3. Это исключит проблемы с кэшем и cookies

### Проверка 4: Проверьте логи в Vercel

1. Vercel Dashboard → Deployments → ваш деплой
2. Откройте "Functions" или "Logs"
3. Ищите ошибки, связанные с auth

## Частые ошибки:

1. **Добавили URI, но забыли сохранить** - нажмите "Save"!
2. **Не подождали 1-2 минуты** - изменения применяются не мгновенно
3. **Использовали http вместо https** - на Vercel всегда используется https
4. **Добавили лишний слэш в конце** - должно быть `/api/auth/callback/google`, а не `/api/auth/callback/google/`
5. **Использовали другой OAuth Client** - убедитесь, что Client ID совпадает

## Альтернативное решение:

Если ничего не помогает, создайте новый OAuth 2.0 Client ID:

1. В Google Cloud Console → Credentials
2. "Create Credentials" → "OAuth client ID"
3. Выберите "Web application"
4. Добавьте оба redirect URI сразу
5. Скопируйте новый Client ID и Secret
6. Обновите переменные окружения в Vercel
7. Перезапустите деплой

