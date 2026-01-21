"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { LikeButton } from "./like-button"

interface PromptCardPublicProps {
  prompt: {
    id: string
    title: string
    content: string
    description?: string | null
    createdAt: Date
    updatedAt: Date
    likesCount?: number
    likedByMe?: boolean
    owner?: {
      id: string
      name?: string | null
      email: string
    }
  }
  userId?: string | null
}

export function PromptCardPublic({ prompt, userId }: PromptCardPublicProps) {
  const preview = prompt.content.substring(0, 150)
  const hasMore = prompt.content.length > 150

  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex-1 min-w-0">{prompt.title}</CardTitle>
        {prompt.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {prompt.description}
          </p>
        )}
        {prompt.owner && (
          <p className="text-xs text-muted-foreground mt-2">
            Автор: {prompt.owner.name || prompt.owner.email}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pb-3">
        <div className="flex-1 space-y-3">
          <div className="text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4 inline mr-1" />
            {preview}
            {hasMore && "..."}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(prompt.createdAt), {
                  addSuffix: true,
                })}
              </span>
              {userId && (
                <LikeButton
                  promptId={prompt.id}
                  initialLiked={prompt.likedByMe || false}
                  initialCount={prompt.likesCount || 0}
                />
              )}
              {!userId && prompt.likesCount !== undefined && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>❤️ {prompt.likesCount}</span>
                </div>
              )}
            </div>
            <Link href={`/prompts/${prompt.id}`}>
              <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                <ExternalLink className="h-3 w-3 mr-1.5" />
                Открыть
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

