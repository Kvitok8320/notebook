import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { signOut } from "@/auth"

export default async function MyPromptsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const userId = (session.user.id || session.user.email) as string
  
  if (!userId) {
    redirect("/login")
  }

  // Получаем промты пользователя
  const prompts = await prisma.prompt.findMany({
    where: { ownerId: userId },
    include: {
      category: true,
      votes: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Мои промты ({prompts.length})
          </h1>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link
              href="/dashboard"
              style={{
                padding: "0.5rem 1rem",
                background: "#6b7280",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "600",
              }}
            >
              ← Dashboard
            </Link>
            <form
              action={async () => {
                "use server"
                const { signOut } = await import("@/auth")
                await signOut({ redirectTo: "/" })
              }}
            >
              <button
                type="submit"
                style={{
                  padding: "0.5rem 1rem",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Выйти
              </button>
            </form>
          </div>
        </div>

        {prompts.length === 0 ? (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "#999",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              У вас пока нет промтов
            </p>
            <p style={{ color: "#666" }}>
              Создайте свой первый промт через просмотрщик БД или API
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {prompts.map((prompt) => (
              <div
                key={prompt.id}
                style={{
                  padding: "1.5rem",
                  background: "#f9f9f9",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    {prompt.title}
                  </h3>
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      background:
                        prompt.visibility === "PUBLIC" ? "#10b981" : "#6b7280",
                      color: "white",
                      borderRadius: "12px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                  >
                    {prompt.visibility === "PUBLIC" ? "Публичный" : "Приватный"}
                  </span>
                </div>
                {prompt.description && (
                  <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                    {prompt.description}
                  </p>
                )}
                <p
                  style={{
                    color: "#999",
                    fontSize: "0.9rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  Категория: {prompt.category.category} | Голосов: {prompt.votes.length}
                </p>
                <p
                  style={{
                    color: "#999",
                    fontSize: "0.85rem",
                    fontFamily: "monospace",
                  }}
                >
                  ID: {prompt.id}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

