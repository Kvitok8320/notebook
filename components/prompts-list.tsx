"use client"

import { useState, useEffect } from "react"
import { PromptCard } from "./prompt-card"
import { PromptDialog } from "./prompt-dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Plus, Search, TrendingUp, Clock } from "lucide-react"
import {
  createPrompt,
  updatePrompt,
  deletePrompt,
  togglePublic,
  toggleFavorite,
} from "@/lib/actions/prompts"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/lib/hooks/use-debounce"

interface Prompt {
  id: string
  title: string
  content: string
  description?: string | null
  isPublic: boolean
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
  categoryId: string
  category?: {
    id: string
    category: string
  }
  likesCount?: number
  likedByMe?: boolean
  ownerId?: string
  owner?: {
    id: string
    name?: string | null
    email: string
  }
}

interface PromptsListProps {
  initialPrompts: Prompt[]
  userId: string
  filter: "all" | "public" | "favorites"
  search?: string
  sort?: string
  showCreateButton?: boolean
}

export function PromptsList({
  initialPrompts,
  userId,
  filter,
  search: initialSearch = "",
  sort: initialSort = "recent",
  showCreateButton = true,
}: PromptsListProps) {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts)
  const [search, setSearch] = useState(initialSearch)
  const [sort, setSort] = useState(initialSort)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const router = useRouter()

  // Синхронизируем prompts с initialPrompts при изменении
  useEffect(() => {
    setPrompts(initialPrompts)
  }, [initialPrompts])

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (debouncedSearch !== initialSearch || sort !== initialSort) {
      const path = filter === "all" ? "/dashboard" : `/dashboard/${filter}`
      const params = new URLSearchParams()
      if (debouncedSearch) params.set("search", debouncedSearch)
      if (sort && sort !== "recent") params.set("sort", sort)
      const query = params.toString()
      router.push(`${path}${query ? `?${query}` : ""}`)
    }
  }, [debouncedSearch, sort, router, initialSearch, initialSort, filter])

  const handleCreate = async (data: {
    title: string
    content: string
    description?: string
    isPublic: boolean
    categoryId: string
  }) => {
    const result = await createPrompt(data)
    if (result.success) {
      router.refresh()
      setIsDialogOpen(false)
    } else {
      alert(result.error)
    }
  }

  const handleUpdate = async (data: {
    title: string
    content: string
    description?: string
    isPublic: boolean
    categoryId: string
  }) => {
    if (!editingPrompt) return
    const result = await updatePrompt(editingPrompt.id, data)
    if (result.success) {
      router.refresh()
      setIsDialogOpen(false)
      setEditingPrompt(null)
    } else {
      alert(result.error)
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deletePrompt(id)
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error)
    }
  }

  const handleTogglePublic = async (id: string) => {
    const result = await togglePublic(id)
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error)
    }
  }

  const handleToggleFavorite = async (id: string) => {
    const result = await toggleFavorite(id)
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error)
    }
  }

  const handleEdit = (id: string) => {
    const prompt = prompts.find((p) => p.id === id)
    if (prompt) {
      setEditingPrompt(prompt)
      setIsDialogOpen(true)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или содержанию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {filter === "public" && (
          <div className="flex gap-2">
            <Button
              variant={sort === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setSort("recent")}
            >
              <Clock className="h-4 w-4 mr-2" />
              По дате
            </Button>
            <Button
              variant={sort === "popular" ? "default" : "outline"}
              size="sm"
              onClick={() => setSort("popular")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Популярные
            </Button>
          </div>
        )}
        {showCreateButton && (
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Создать промт
          </Button>
        )}
      </div>

      {prompts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">Нет промтов</p>
          <p className="text-sm">
            {search
              ? "Попробуйте изменить поисковый запрос"
              : "Создайте свой первый промт"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              userId={userId}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTogglePublic={handleTogglePublic}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      <PromptDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingPrompt(null)
        }}
        prompt={editingPrompt}
        onSubmit={editingPrompt ? handleUpdate : handleCreate}
      />
    </div>
  )
}

