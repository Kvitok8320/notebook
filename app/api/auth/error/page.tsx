import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams.error

  const errorMessages: Record<string, string> = {
    Configuration: "Проблема с конфигурацией сервера. Проверьте настройки.",
    AccessDenied: "Доступ запрещен. У вас нет прав для входа.",
    Verification: "Ошибка верификации. Ссылка для входа недействительна или истекла.",
    Default: "Произошла ошибка при входе. Попробуйте снова.",
  }

  const message = errorMessages[error || ""] || errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Ошибка авторизации</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{message}</p>
          {error && (
            <p className="text-sm text-muted-foreground">
              Код ошибки: <code className="bg-muted px-2 py-1 rounded">{error}</code>
            </p>
          )}
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/login">Попробовать снова</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">На главную</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

