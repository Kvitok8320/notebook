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
      if (process.env.NODE_ENV === "development") {
        console.log("[Auth] Session callback:", { userId: user?.id, email: session.user?.email })
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Разрешаем вход для всех пользователей
      if (process.env.NODE_ENV === "development") {
        console.log("[Auth] SignIn callback:", { userId: user?.id, email: user?.email })
      }
      return true
    },
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
})

