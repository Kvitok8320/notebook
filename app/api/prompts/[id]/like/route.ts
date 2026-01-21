import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const promptId = params.id

    // Проверяем, что промт существует и публичный
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
      select: { id: true, isPublic: true },
    })

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      )
    }

    if (!prompt.isPublic) {
      return NextResponse.json(
        { error: "Cannot like private prompt" },
        { status: 403 }
      )
    }

    // Проверяем, есть ли уже лайк
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_promptId: {
          userId,
          promptId,
        },
      },
    })

    let liked: boolean

    if (existingVote) {
      // Удаляем лайк
      await prisma.vote.delete({
        where: {
          userId_promptId: {
            userId,
            promptId,
          },
        },
      })
      liked = false
    } else {
      // Создаем лайк
      await prisma.vote.create({
        data: {
          userId,
          promptId,
          value: 1,
        },
      })
      liked = true
    }

    // Получаем количество лайков
    const likesCount = await prisma.vote.count({
      where: { promptId },
    })

    return NextResponse.json({
      liked,
      likesCount,
    })
  } catch (error: any) {
    console.error("Error toggling like:", error)
    return NextResponse.json(
      { error: error.message || "Failed to toggle like" },
      { status: 500 }
    )
  }
}

