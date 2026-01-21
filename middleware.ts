import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req: NextRequest & { auth?: any }) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Отладка (включая production для диагностики)
  console.log("[Middleware] Path:", pathname, "Auth:", !!req.auth, "User:", req.auth?.user?.email)

  // Исключаем API routes и статические файлы из проверки
  // NextAuth сам обработает callback и установит сессию
  if (pathname.startsWith("/api/auth")) {
    console.log("[Middleware] API auth route, allowing through:", pathname)
    return NextResponse.next()
  }

  // Защищенные маршруты
  const protectedRoutes = ["/dashboard", "/my-prompts"]
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Если пользователь уже на странице логина и авторизован, редиректим на dashboard
  if (pathname === "/login" && isLoggedIn) {
    console.log("[Middleware] User logged in, redirecting from /login to /dashboard")
    console.log("[Middleware] User details:", { id: req.auth?.user?.id, email: req.auth?.user?.email })
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
  
  // Если это /login и пользователь не авторизован, разрешаем доступ
  if (pathname === "/login" && !isLoggedIn) {
    console.log("[Middleware] Allowing access to /login (user not logged in)")
    return NextResponse.next()
  }

  // Если пытается зайти на защищенный маршрут без авторизации
  if (isProtectedRoute && !isLoggedIn) {
    console.log("[Middleware] Protected route without auth, redirecting to login")
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

