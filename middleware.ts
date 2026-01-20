import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req: NextRequest & { auth?: any }) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Отладка (только в development)
  if (process.env.NODE_ENV === "development") {
    console.log("[Middleware] Path:", pathname, "Auth:", !!req.auth, "User:", req.auth?.user?.email)
  }

  // Исключаем API routes и статические файлы из проверки
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // Защищенные маршруты
  const protectedRoutes = ["/dashboard", "/my-prompts"]
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Если пользователь уже на странице логина и авторизован, редиректим на dashboard
  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Если пытается зайти на защищенный маршрут без авторизации
  if (isProtectedRoute && !isLoggedIn) {
    // Проверяем, не идет ли это после callback от Google
    // В этом случае даем немного времени на сохранение сессии
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

