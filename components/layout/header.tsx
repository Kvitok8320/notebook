import Link from "next/link"
import { auth } from "@/auth"
import { signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, User } from "lucide-react"

export async function Header() {
  const session = await auth()

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Лого/название */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">📓 Notebook</span>
          </Link>

          {/* Навигация */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Главная
            </Link>
            <Link
              href="/catalog"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Каталог
            </Link>
            {session?.user && (
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Мои промты
              </Link>
            )}
          </nav>

          {/* Правая часть: вход/выход */}
          <div className="flex items-center gap-4">
            {session?.user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                  <span className="text-muted-foreground">
                    {session.user.name || session.user.email}
                  </span>
                </div>
                <form
                  action={async () => {
                    "use server"
                    await signOut({ redirectTo: "/" })
                  }}
                >
                  <Button type="submit" variant="outline" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Выйти</span>
                  </Button>
                </form>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Войти
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

