import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LikeButton } from "@/components/like-button"
import { ArrowLeft, MessageSquare } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

async function getPrompt(id: string, userId: string | null) {
  const prompt = await prisma.prompt.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: {
        select: {
          id: true,
          category: true,
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
  })

  if (!prompt) {
    return null
  }

  // Если промт приватный и пользователь не владелец - не показываем
  if (!prompt.isPublic && prompt.ownerId !== userId) {
    return null
  }

  return {
    ...prompt,
    createdAt: new Date(prompt.createdAt),
    updatedAt: new Date(prompt.updatedAt),
    likesCount: prompt._count.votes,
    likedByMe: userId ? prompt.votes.length > 0 : false,
  }
}

export default async function PromptPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  const userId = session?.user?.id || null

  const prompt = await getPrompt(params.id, userId)

  if (!prompt) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к главной
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{prompt.title}</CardTitle>
              {prompt.description && (
                <p className="text-muted-foreground text-lg mb-4">
                  {prompt.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Автор: {prompt.owner.name || prompt.owner.email}
                </span>
                <span>•</span>
                <span>
                  {formatDistanceToNow(prompt.createdAt, { addSuffix: true })}
                </span>
                {prompt.category && (
                  <>
                    <span>•</span>
                    <span>Категория: {prompt.category.category}</span>
                  </>
                )}
              </div>
            </div>
            {userId && (
              <LikeButton
                promptId={prompt.id}
                initialLiked={prompt.likedByMe}
                initialCount={prompt.likesCount}
              />
            )}
            {!userId && prompt.likesCount !== undefined && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>❤️ {prompt.likesCount}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Содержание промта:</h3>
                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg font-sans">
                  {prompt.content}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

