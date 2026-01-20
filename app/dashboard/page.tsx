import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PromptsList } from "@/components/prompts-list"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const session = await auth()

  // Middleware уже проверил авторизацию, но проверяем еще раз для безопасности
  if (!session?.user?.id) {
    // Если нет сессии, редиректим на логин
    // Это может произойти, если сессия еще не сохранилась после входа
    redirect("/login?error=SessionNotFound")
  }

  const userId = session.user.id
  const search = searchParams.search || ""

  // Убеждаемся, что есть хотя бы одна категория
  let defaultCategory = await prisma.category.findFirst()
  if (!defaultCategory) {
    defaultCategory = await prisma.category.create({
      data: { category: "General" },
    })
  }

  // Получаем все промты пользователя
  const prompts = await prisma.prompt.findMany({
    where: {
      ownerId: userId,
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
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Все промты</h1>
        <p className="text-muted-foreground">
          Управляйте всеми вашими промтами
        </p>
      </div>
      <PromptsList
        initialPrompts={prompts.map((p) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        }))}
        userId={userId}
        filter="all"
        search={search}
      />
    </div>
  )
}
