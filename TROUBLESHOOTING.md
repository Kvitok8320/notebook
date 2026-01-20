# Устранение проблем с авторизацией

## Проблема: Редирект на логин вместо дашборда после входа

### Возможные причины:

1. **Сессия не сохраняется в БД**
   - Проверьте, что таблицы `sessions` и `accounts` созданы в базе данных
   - Выполните: `npx prisma db push` или `npx prisma migrate dev`

2. **Проблема с cookies на Vercel**
   - Убедитесь, что `AUTH_SECRET` установлен в переменных окружения Vercel
   - Проверьте, что используется `https://` (не `http://`)

3. **Redirect URI не настроен**
   - Убедитесь, что в Google Cloud Console добавлен правильный redirect URI
   - Формат: `https://your-project.vercel.app/api/auth/callback/google`

4. **Сессия не успевает сохраниться**
   - После callback от Google может потребоваться время на сохранение сессии
   - Попробуйте обновить страницу через несколько секунд

### Решение:

1. **Проверьте таблицы в БД:**
   ```sql
   SELECT * FROM sessions;
   SELECT * FROM accounts;
   SELECT * FROM users;
   ```

2. **Проверьте переменные окружения в Vercel:**
   - `AUTH_SECRET` - должен быть установлен
   - `GOOGLE_CLIENT_ID` - ваш Google Client ID
   - `GOOGLE_CLIENT_SECRET` - ваш Google Client Secret
   - `DATABASE_URL` - строка подключения к БД

3. **Проверьте логи в Vercel:**
   - Перейдите в Vercel Dashboard → Deployments → ваш деплой → Functions
   - Ищите ошибки связанные с auth или database

4. **Очистите cookies и попробуйте снова:**
   - Очистите cookies для вашего домена Vercel
   - Попробуйте войти снова

### Отладка:

В development режиме добавлено логирование:
- `[Middleware]` - показывает, видит ли middleware сессию
- `[Auth] Session callback` - показывает данные сессии
- `[Auth] SignIn callback` - показывает данные при входе

Проверьте консоль браузера и логи сервера для отладки.

