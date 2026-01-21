import Link from "next/link"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { PromptCardPublic } from "@/components/prompt-card-public"
import { Plus, Sparkles, TrendingUp } from "lucide-react"

async function getRecentPrompts(userId: string | null) {
  const prompts = await prisma.prompt.findMany({
    where: {
      isPublic: true,
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
    take: 20,
  })

  return prompts.map((p) => ({
    ...p,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
    likesCount: p._count.votes,
    likedByMe: userId ? p.votes.length > 0 : false,
  }))
}

async function getPopularPrompts(userId: string | null) {
  // Получаем промты с подсчетом лайков
  const prompts = await prisma.prompt.findMany({
    where: {
      isPublic: true,
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
    take: 100, // Берем больше, чтобы отсортировать по лайкам
  })

  // Сортируем по количеству лайков (desc), затем по дате создания (desc)
  const sortedPrompts = prompts
    .map((p) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
      likesCount: p._count.votes,
      likedByMe: userId ? p.votes.length > 0 : false,
    }))
    .sort((a, b) => {
      // Сначала по количеству лайков
      if (b.likesCount !== a.likesCount) {
        return b.likesCount - a.likesCount
      }
      // Затем по дате создания
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
    .slice(0, 20) // Берем топ 20

  return sortedPrompts
}

export default async function Home() {
  const session = await auth()
  const userId = session?.user?.id || null

  const [recentPrompts, popularPrompts] = await Promise.all([
    getRecentPrompts(userId),
    getPopularPrompts(userId),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero-блок */}
      <section className="text-center py-12 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Добро пожаловать в Notebook
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Коллекция лучших промтов для работы с AI. Создавайте, делитесь и
          находите идеальные промты для ваших задач.
        </p>
        {session?.user ? (
          <Link href="/dashboard">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Добавить промт
            </Button>
          </Link>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Link href="/login">
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Добавить промт
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Войдите, чтобы добавлять промты
            </p>
          </div>
        )}
      </section>

      {/* Секция "Новые" */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Новые</h2>
        </div>
        {recentPrompts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">Пока нет публичных промтов</p>
            <p className="text-sm">
              Станьте первым, кто поделится своим промтом!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentPrompts.map((prompt) => (
              <PromptCardPublic
                key={prompt.id}
                prompt={prompt}
                userId={userId}
              />
            ))}
          </div>
        )}
      </section>

      {/* Секция "Популярные" */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Популярные</h2>
        </div>
        {popularPrompts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">Пока нет популярных промтов</p>
            <p className="text-sm">
              Лайкайте промты, чтобы они стали популярными!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularPrompts.map((prompt) => (
              <PromptCardPublic
                key={prompt.id}
                prompt={prompt}
                userId={userId}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
