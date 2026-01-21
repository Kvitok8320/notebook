import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        userId: true,
        provider: true,
        providerAccountId: true,
      },
      take: 10,
    })

    const sessions = await prisma.session.findMany({
      select: {
        id: true,
        userId: true,
        expires: true,
      },
      take: 10,
    })

    return NextResponse.json({
      users,
      accounts,
      sessions,
      counts: {
        users: users.length,
        accounts: accounts.length,
        sessions: sessions.length,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch debug info" },
      { status: 500 }
    )
  }
}

