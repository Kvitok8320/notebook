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
      console.log("[Auth] SignIn callback:", { 
        userId: user?.id, 
        email: user?.email,
        provider: account?.provider,
        accountId: account?.id
      })
      
      // Проверяем, что пользователь будет создан/найден
      if (!user?.email) {
        console.error("[Auth] SignIn error: No email in user object")
        return false
      }
      
      return true
    },
    async redirect({ url, baseUrl }) {
      // Убеждаемся, что редирект идет на правильный домен
      console.log("[Auth] Redirect callback:", { url, baseUrl })
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: true, // Включаем для отладки на Vercel
})

