"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface PromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prompt?: {
    id: string
    title: string
    content: string
    description?: string | null
    isPublic: boolean
    categoryId: string
  } | null
  onSubmit: (data: {
    title: string
    content: string
    description?: string
    isPublic: boolean
    categoryId: string
  }) => Promise<void>
}

export function PromptDialog({
  open,
  onOpenChange,
  prompt,
  onSubmit,
}: PromptDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState<Array<{ id: string; category: string }>>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      if (prompt) {
        setTitle(prompt.title)
        setContent(prompt.content)
        setDescription(prompt.description || "")
        setIsPublic(prompt.isPublic)
        setCategoryId(prompt.categoryId)
      } else {
        setTitle("")
        setContent("")
        setDescription("")
        setIsPublic(false)
        setCategoryId("")
      }
    }
  }, [open, prompt])

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
          if (data.categories?.length > 0 && !categoryId) {
            setCategoryId(data.categories[0].id)
          }
        }
      } catch (error) {
        console.error("Failed to load categories:", error)
      }
    }
    if (open) {
      loadCategories()
    }
  }, [open, categoryId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit({
        title,
        content,
        description: description || undefined,
        isPublic,
        categoryId: categoryId || categories[0]?.id || "",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to submit:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {prompt ? "Редактировать промт" : "Создать промт"}
            </DialogTitle>
            <DialogDescription>
              {prompt
                ? "Внесите изменения в промт"
                : "Создайте новый промт для использования"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Заголовок</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Название промта"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Описание (необязательно)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Краткое описание"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Содержание</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Текст промта..."
                rows={8}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Категория</Label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="isPublic" className="cursor-pointer">
                Публичный промт
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Сохранение..." : prompt ? "Сохранить" : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

