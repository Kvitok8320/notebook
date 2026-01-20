"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Dashboard error:", error)
  }, [error])

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Произошла ошибка</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {error.message || "Не удалось загрузить данные"}
          </p>
          <div className="flex gap-2">
            <Button onClick={reset}>Попробовать снова</Button>
            <Button variant="outline" onClick={() => window.location.href = "/login"}>
              Выйти и войти снова
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

