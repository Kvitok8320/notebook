"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Pencil,
  Trash2,
  Globe,
  Lock,
  Star,
  MessageSquare,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { LikeButton } from "./like-button"

interface PromptCardProps {
  prompt: {
    id: string
    title: string
    content: string
    description?: string | null
    isPublic: boolean
    isFavorite: boolean
    createdAt: Date
    updatedAt: Date
    likesCount?: number
    likedByMe?: boolean
  }
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onTogglePublic: (id: string) => void
  onToggleFavorite: (id: string) => void
}

export function PromptCard({
  prompt,
  onEdit,
  onDelete,
  onTogglePublic,
  onToggleFavorite,
}: PromptCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить этот промт?")) {
      return
    }
    setIsDeleting(true)
    await onDelete(prompt.id)
    setIsDeleting(false)
  }

  const preview = prompt.content.substring(0, 150)
  const hasMore = prompt.content.length > 150

  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg flex-1 min-w-0 pr-2">{prompt.title}</CardTitle>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite(prompt.id)}
              className={`h-8 w-8 ${prompt.isFavorite ? "text-yellow-500" : ""}`}
            >
              <Star
                className={`h-4 w-4 ${prompt.isFavorite ? "fill-current" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onTogglePublic(prompt.id)}
              className="h-8 w-8"
            >
              {prompt.isPublic ? (
                <Globe className="h-4 w-4 text-blue-500" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {prompt.description && (
          <p className="text-sm text-muted-foreground mt-2">{prompt.description}</p>
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
                Обновлено{" "}
                {formatDistanceToNow(new Date(prompt.updatedAt), {
                  addSuffix: true,
                })}
              </span>
              {prompt.isPublic && (
                <LikeButton
                  promptId={prompt.id}
                  initialLiked={prompt.likedByMe || false}
                  initialCount={prompt.likesCount || 0}
                />
              )}
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(prompt.id)}
                className="h-8 px-2 text-xs"
              >
                <Pencil className="h-3 w-3 mr-1.5" />
                <span className="hidden sm:inline">Редактировать</span>
                <span className="sm:hidden">Изменить</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-8 px-2 text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1.5" />
                Удалить
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

