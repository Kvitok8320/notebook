"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const promptSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  isPublic: z.boolean().default(false),
})

export async function createPrompt(data: z.infer<typeof promptSchema>) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    const validated = promptSchema.parse(data)
    
    // Получаем первую категорию или создаем дефолтную
    let category = await prisma.category.findFirst()
    if (!category) {
      category = await prisma.category.create({
        data: { category: "General" },
      })
    }

    const prompt = await prisma.prompt.create({
      data: {
        ...validated,
        ownerId: session.user.id,
        categoryId: validated.categoryId || category.id,
        visibility: validated.isPublic ? "PUBLIC" : "PRIVATE",
      },
    })

    revalidatePath("/dashboard")
    return { success: true, data: prompt }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: error.message || "Failed to create prompt" }
  }
}

export async function updatePrompt(
  id: string,
  data: Partial<z.infer<typeof promptSchema>>
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    // Проверяем, что промт принадлежит пользователю
    const existing = await prisma.prompt.findFirst({
      where: { id, ownerId: session.user.id },
    })

    if (!existing) {
      return { error: "Prompt not found" }
    }

    const updateData: any = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.content !== undefined) updateData.content = data.content
    if (data.description !== undefined) updateData.description = data.description
    if (data.isPublic !== undefined) {
      updateData.isPublic = data.isPublic
      updateData.visibility = data.isPublic ? "PUBLIC" : "PRIVATE"
    }

    const prompt = await prisma.prompt.update({
      where: { id },
      data: updateData,
    })

    revalidatePath("/dashboard")
    return { success: true, data: prompt }
  } catch (error: any) {
    return { error: error.message || "Failed to update prompt" }
  }
}

export async function deletePrompt(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    // Проверяем, что промт принадлежит пользователю
    const existing = await prisma.prompt.findFirst({
      where: { id, ownerId: session.user.id },
    })

    if (!existing) {
      return { error: "Prompt not found" }
    }

    await prisma.prompt.delete({
      where: { id },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to delete prompt" }
  }
}

export async function togglePublic(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    const prompt = await prisma.prompt.findFirst({
      where: { id, ownerId: session.user.id },
    })

    if (!prompt) {
      return { error: "Prompt not found" }
    }

    const updated = await prisma.prompt.update({
      where: { id },
      data: {
        isPublic: !prompt.isPublic,
        visibility: !prompt.isPublic ? "PUBLIC" : "PRIVATE",
      },
    })

    revalidatePath("/dashboard")
    return { success: true, data: updated }
  } catch (error: any) {
    return { error: error.message || "Failed to toggle public" }
  }
}

export async function toggleFavorite(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    const prompt = await prisma.prompt.findFirst({
      where: { id, ownerId: session.user.id },
    })

    if (!prompt) {
      return { error: "Prompt not found" }
    }

    const updated = await prisma.prompt.update({
      where: { id },
      data: {
        isFavorite: !prompt.isFavorite,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, data: updated }
  } catch (error: any) {
    return { error: error.message || "Failed to toggle favorite" }
  }
}

