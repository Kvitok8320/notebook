# 🔧 Настройка DATABASE_URL

## Возможные проблемы:

1. **"invalid port number in database URL"** - неправильный формат строки
2. **"P1000: Authentication failed"** - неверные учетные данные (username/password)

## Решение ошибки аутентификации (P1000)

## Решение

### 1. Создайте файл `.env` в корне проекта

```bash
# В PowerShell (Windows)
New-Item -Path .env -ItemType File

# Или создайте файл вручную через редактор
```

### 2. Получите правильную строку подключения из Neon

**ВАЖНО:** В Neon есть несколько типов строк подключения. Для Prisma нужно использовать правильный вариант.

1. Перейдите на [console.neon.tech](https://console.neon.tech)
2. Выберите ваш проект
3. Перейдите в раздел **Connection Details**
4. Найдите секцию **Connection string** или **Prisma**
5. **Используйте строку подключения с полным username и password**

**Варианты строк подключения в Neon:**

- **Direct connection** (без pooler):
  ```
  postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
  ```

- **Pooled connection** (через pooler, для serverless):
  ```
  postgresql://username:password@ep-xxx-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
  ```

**Для Prisma рекомендуется использовать Direct connection** (без `-pooler` в хосте).

### 3. Правильный формат строки подключения

Строка подключения из Neon обычно выглядит так:

```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/database?sslmode=require
```

Или с портом:

```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech:5432/database?sslmode=require
```

### 4. Важные моменты

#### Если пароль содержит специальные символы

Если ваш пароль содержит специальные символы (`@`, `:`, `/`, `?`, `#`, `[`, `]`, `%`, `&`), их нужно **URL-кодировать**:

| Символ | Код |
|--------|-----|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `#` | `%23` |
| `[` | `%5B` |
| `]` | `%5D` |
| `%` | `%25` |
| `&` | `%26` |
| ` ` (пробел) | `%20` |

**Пример:**
Если пароль: `my@pass:word`
Замените на: `my%40pass%3Aword`

#### Формат в `.env` файле

Добавьте строку в `.env` файл **БЕЗ пробелов** вокруг `=`:

```env
DATABASE_URL="postgresql://user:password@host.neon.tech/database?sslmode=require"
```

**Важно:**
- Используйте кавычки вокруг значения
- Не добавляйте пробелы: `DATABASE_URL = "..."` ❌
- Правильно: `DATABASE_URL="..."` ✅

### 5. Пример правильного `.env` файла

```env
DATABASE_URL="postgresql://neondb_owner:npg_xxxxxxxxxxxx@ep-xxxx-xxxx.region.aws.neon.tech/neondb?sslmode=require"
```

### 6. Проверка

После настройки `.env` файла, попробуйте снова:

```bash
npm run db:push
```

Если ошибка сохраняется:
1. Проверьте, что файл `.env` находится в корне проекта (там же, где `package.json`)
2. Убедитесь, что в строке нет лишних пробелов или символов
3. Проверьте, что все специальные символы в пароле URL-кодированы
4. Убедитесь, что строка взята из Neon консоли полностью

### 7. Проверка учетных данных

Если ошибка **P1000: Authentication failed** сохраняется:

1. **Проверьте username и password:**
   - Убедитесь, что скопировали полную строку из Neon
   - Username обычно начинается с `neondb_owner` или похожего
   - Password обычно начинается с `npg_` и содержит длинную строку

2. **Используйте строку подключения БЕЗ pooler:**
   - Если в строке есть `-pooler` в хосте, попробуйте вариант без pooler
   - Пример: `ep-xxx-xxx.region.aws.neon.tech` вместо `ep-xxx-xxx-pooler.region.aws.neon.tech`

3. **Проверьте URL-кодирование пароля:**
   - Если пароль содержит специальные символы, они должны быть закодированы
   - Используйте онлайн-инструмент для URL-кодирования или таблицу выше

4. **Скопируйте строку подключения заново:**
   - В Neon Dashboard найдите раздел "Connection string"
   - Выберите формат "Prisma" или "Connection string"
   - Скопируйте строку полностью, включая username и password

5. **Проверьте формат в `.env`:**
   ```env
   # Правильно:
   DATABASE_URL="postgresql://neondb_owner:npg_xxxxxxxxxxxx@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
   
   # Неправильно (пробелы вокруг =):
   DATABASE_URL = "postgresql://..."
   
   # Неправильно (без кавычек, если есть спецсимволы):
   DATABASE_URL=postgresql://...
   ```

### 8. Альтернативный способ (через Neon Dashboard)

В Neon Dashboard можно сгенерировать строку подключения с уже закодированным паролем:
1. Откройте Connection Details
2. Выберите опцию "Connection string" или "Prisma"
3. Скопируйте готовую строку **полностью**
4. Убедитесь, что строка содержит username и password (не пустые поля)

