"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Heart } from "lucide-react"

interface LikeButtonProps {
  promptId: string
  initialLiked: boolean
  initialCount: number
}

export function LikeButton({
  promptId,
  initialLiked,
  initialCount,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (loading) return

    setLoading(true)
    try {
      const response = await fetch(`/api/prompts/${promptId}/like`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to toggle like")
      }

      const data = await response.json()
      setLiked(data.liked)
      setCount(data.likesCount)
    } catch (error: any) {
      console.error("Error toggling like:", error)
      alert(error.message || "Не удалось поставить лайк")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={loading}
      className={`h-8 px-2 text-xs ${
        liked ? "text-red-500 hover:text-red-600" : ""
      }`}
    >
      <Heart
        className={`h-3 w-3 mr-1.5 ${liked ? "fill-current" : ""}`}
      />
      <span>{count}</span>
    </Button>
  )
}

