import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PromptsList } from "@/components/prompts-list"

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const userId = session.user.id
  const search = searchParams.search || ""

  // Получаем избранные промты пользователя
  const prompts = await prisma.prompt.findMany({
    where: {
      ownerId: userId,
      isFavorite: true,
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
        <h1 className="text-3xl font-bold">Избранное</h1>
        <p className="text-muted-foreground">
          Ваши избранные промты
        </p>
      </div>
      <PromptsList
        initialPrompts={prompts.map((p) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        }))}
        userId={userId}
        filter="favorites"
        search={search}
      />
    </div>
  )
}

