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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{prompt.title}</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite(prompt.id)}
              className={prompt.isFavorite ? "text-yellow-500" : ""}
            >
              <Star
                className={`h-4 w-4 ${prompt.isFavorite ? "fill-current" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onTogglePublic(prompt.id)}
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
          <p className="text-sm text-muted-foreground">{prompt.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4 inline mr-1" />
            {preview}
            {hasMore && "..."}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Обновлено{" "}
              {formatDistanceToNow(new Date(prompt.updatedAt), {
                addSuffix: true,
              })}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(prompt.id)}
              >
                <Pencil className="h-3 w-3 mr-1" />
                Редактировать
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Удалить
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

