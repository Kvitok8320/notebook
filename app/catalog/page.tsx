import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { PromptCardPublic } from "@/components/prompt-card-public"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

async function getPublicPrompts(userId: string | null, search?: string) {
  const prompts = await prisma.prompt.findMany({
    where: {
      isPublic: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
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
      ...(userId && {
        votes: {
          where: {
            userId: userId,
          },
          select: {
            id: true,
          },
        },
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  })

  return prompts.map((p) => ({
    ...p,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
    likesCount: p._count.votes,
    likedByMe: userId ? p.votes.length > 0 : false,
  }))
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const session = await auth()
  const userId = session?.user?.id || null
  const search = searchParams.search || ""

  const prompts = await getPublicPrompts(userId, search)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Каталог промтов</h1>
        <p className="text-muted-foreground mb-6">
          Просматривайте все публичные промты сообщества
        </p>
        <form method="get" className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Поиск по названию или содержанию..."
              defaultValue={search}
              className="pl-10"
            />
          </div>
        </form>
      </div>

      {prompts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">
            {search ? "Ничего не найдено" : "Пока нет публичных промтов"}
          </p>
          <p className="text-sm">
            {search
              ? "Попробуйте изменить поисковый запрос"
              : "Станьте первым, кто поделится своим промтом!"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCardPublic
              key={prompt.id}
              prompt={prompt}
              userId={userId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

