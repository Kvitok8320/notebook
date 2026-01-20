# Как указать Vercel конкретный коммит для деплоя

## Способ 1: Через Vercel Dashboard (Рекомендуется)

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите ваш проект
3. Перейдите в раздел **Deployments**
4. Найдите нужный коммит в списке
5. Нажмите на три точки (⋯) рядом с коммитом
6. Выберите:
   - **Redeploy** - пересобрать этот коммит
   - **Promote to Production** - сделать его продакшен версией

## Способ 2: Через Vercel CLI

```bash
# Установите Vercel CLI (если еще не установлен)
npm i -g vercel

# Войдите в Vercel
vercel login

# Задеплойте конкретный коммит
vercel --prod

# Или укажите конкретный коммит
git checkout <commit-hash>
vercel --prod
```

## Способ 3: Через настройки проекта

1. В Vercel Dashboard → Settings → Git
2. Проверьте, какая ветка используется для Production
3. Убедитесь, что выбрана правильная ветка (обычно `main` или `master`)

## Способ 4: Создать новый коммит (триггер деплоя)

Если нужно задеплоить последний коммит:

```bash
# Создать пустой коммит для триггера
git commit --allow-empty -m "Trigger Vercel deployment"
git push origin main
```

## Текущие коммиты в репозитории

Последние коммиты:
- `f66ff1c` - Trigger Vercel rebuild (самый новый)
- `daa7118` - Add Node.js engine requirement
- `c12e074` - Refactor middleware
- `9c7c8c0` - Refactor user ID retrieval
- `0456127` - Refactor API route model retrieval (содержит исправление getPrismaModel)

## Проверка коммита перед деплоем

Чтобы проверить, какой код в конкретном коммите:

```bash
git show <commit-hash>:app/api/view-db/[table]/route.ts | grep -E "getPrismaModel|prisma as any"
```

Если видите `getPrismaModel` - коммит правильный ✅
Если видите `prisma as any` - коммит старый ❌

