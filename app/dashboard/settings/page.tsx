import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Настройки</h1>
        <p className="text-muted-foreground">
          Управление настройками аккаунта
        </p>
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Профиль</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
            {session.user.name && (
              <div>
                <p className="text-sm font-medium">Имя</p>
                <p className="text-sm text-muted-foreground">{session.user.name}</p>
              </div>
            )}
            {session.user.image && (
              <div>
                <p className="text-sm font-medium">Аватар</p>
                <img
                  src={session.user.image}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full mt-2"
                />
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Выход</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              action={async () => {
                "use server"
                const { signOut } = await import("@/auth")
                await signOut({ redirectTo: "/" })
              }}
            >
              <button
                type="submit"
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
              >
                Выйти из аккаунта
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

