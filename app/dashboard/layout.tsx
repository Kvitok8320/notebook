import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Проверка авторизации уже выполняется в middleware.ts
  // Не нужно дублировать проверку здесь, чтобы избежать циклов редиректов

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}

