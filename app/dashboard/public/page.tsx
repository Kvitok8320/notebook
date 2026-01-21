import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PromptsList } from "@/components/prompts-list"

export default async function PublicPromptsPage({
  searchParams,
}: {
  searchParams: { search?: string; sort?: string }
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const userId = session.user.id
  const search = searchParams.search || ""
  const sort = searchParams.sort || "recent"

  // Убеждаемся, что есть хотя бы одна категория
  let defaultCategory = await prisma.category.findFirst()
  if (!defaultCategory) {
    defaultCategory = await prisma.category.create({
      data: { category: "General" },
    })
  }

  // Получаем ВСЕ публичные промты от всех пользователей с лайками
  let prompts = await prisma.prompt.findMany({
    where: {
      isPublic: true, // Убрали фильтр по ownerId - показываем все публичные промты
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      category: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          votes: true,
        },
      },
      votes: {
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50, // Берем больше для сортировки
  })

  // Сортируем по популярности если нужно
  if (sort === "popular") {
    prompts = prompts.sort((a, b) => {
      const aCount = a._count.votes
      const bCount = b._count.votes
      if (aCount !== bCount) {
        return bCount - aCount
      }
      // Если количество лайков одинаковое, сортируем по дате
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }

  // Ограничиваем результат
  prompts = prompts.slice(0, 10)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Все публичные промты</h1>
        <p className="text-muted-foreground">
          Публичные промты от всех пользователей
        </p>
      </div>
      <PromptsList
        initialPrompts={prompts.map((p) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          likesCount: p._count.votes,
          likedByMe: p.votes.length > 0,
          ownerId: p.ownerId,
          owner: p.owner,
        }))}
        userId={userId}
        filter="public"
        search={search}
        sort={sort}
        showCreateButton={false}
      />
    </div>
  )
}

