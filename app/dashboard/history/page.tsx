import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function HistoryPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">История</h1>
        <p className="text-muted-foreground">
          История ваших действий (в разработке)
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>История изменений</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Функция истории изменений будет добавлена в будущих обновлениях.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

