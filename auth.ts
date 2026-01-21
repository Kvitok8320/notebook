import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true, // Разрешаем связывание аккаунтов по email
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/api/auth/error",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 дней
    updateAge: 24 * 60 * 60, // обновлять каждый день
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id
      }
      // Логирование для отладки на Vercel
      console.log("[Auth] Session callback:", { 
        userId: user?.id, 
        email: session.user?.email,
        hasSession: !!session 
      })
      return session
    },
    async signIn({ user, account, profile }) {
      // Разрешаем вход для всех пользователей
      console.log("[Auth] SignIn callback (BEFORE adapter):", { 
        userId: user?.id, 
        email: user?.email,
        name: user?.name,
        image: user?.image,
        provider: account?.provider,
        accountId: account?.id,
        profileEmail: (profile as any)?.email
      })
      
      // Проверяем, что есть email
      if (!user?.email) {
        console.error("[Auth] SignIn error: No email in user object")
        return false
      }
      
      // PrismaAdapter автоматически создаст пользователя после этого callback
      // Возвращаем true, чтобы разрешить создание
      console.log("[Auth] SignIn callback: Allowing sign in, adapter will create user/account")
      return true
    },
    async jwt({ token, user, account, profile }) {
      // Этот callback вызывается для JWT стратегии, но у нас database стратегия
      // Оставляем для совместимости
      if (user) {
        token.id = user.id
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // Убеждаемся, что редирект идет на правильный домен
      console.log("[Auth] Redirect callback:", { url, baseUrl })
      
      // Если это относительный URL, добавляем baseUrl
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`
        console.log("[Auth] Redirecting to:", redirectUrl)
        return redirectUrl
      }
      
      // Если URL того же домена, разрешаем
      try {
        const urlObj = new URL(url)
        if (urlObj.origin === baseUrl) {
          console.log("[Auth] Redirecting to same origin:", url)
          return url
        }
      } catch (e) {
        // Если URL невалидный, игнорируем ошибку
      }
      
      // По умолчанию редиректим на dashboard после входа
      const defaultRedirect = `${baseUrl}/dashboard`
      console.log("[Auth] Default redirect to:", defaultRedirect)
      return defaultRedirect
    },
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: true, // Включаем для отладки на Vercel
})

