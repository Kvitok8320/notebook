import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Получаем статистику пользователя
  const userId = session.user.id as string

  const [promptsCount, notesCount, votesCount] = await Promise.all([
    prisma.prompt.count({ where: { ownerId: userId } }),
    prisma.note.count({ where: { ownerId: userId } }),
    prisma.vote.count({ where: { userId } }),
  ])

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
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
              color: "#333",
            }}
          >
            Добро пожаловать, {session.user.name || session.user.email}!
          </h1>
          {session.user.image && (
            <img
              src={session.user.image}
              alt="Avatar"
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                marginTop: "1rem",
              }}
            />
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              padding: "1.5rem",
              background: "#f9fafb",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "0.5rem" }}>
              Промты
            </h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#333" }}>
              {promptsCount}
            </p>
          </div>

          <div
            style={{
              padding: "1.5rem",
              background: "#f9fafb",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "0.5rem" }}>
              Заметки
            </h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#333" }}>
              {notesCount}
            </p>
          </div>

          <div
            style={{
              padding: "1.5rem",
              background: "#f9fafb",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "0.5rem" }}>
              Голоса
            </h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#333" }}>
              {votesCount}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link
            href="/my-prompts"
            style={{
              padding: "0.75rem 1.5rem",
              background: "#667eea",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "600",
            }}
          >
            Мои промты →
          </Link>
          <Link
            href="/view-db"
            style={{
              padding: "0.75rem 1.5rem",
              background: "#6b7280",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "600",
            }}
          >
            Просмотрщик БД →
          </Link>
          <Link
            href="/"
            style={{
              padding: "0.75rem 1.5rem",
              background: "#e5e7eb",
              color: "#333",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "600",
            }}
          >
            Главная →
          </Link>
        </div>
      </div>
    </div>
  )
}

