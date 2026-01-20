"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  MessageSquare,
  Globe,
  Star,
  History,
  Settings,
  Bookmark,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Все промты", icon: MessageSquare },
  { href: "/dashboard/public", label: "Публичные", icon: Globe },
  { href: "/dashboard/favorites", label: "Избранное", icon: Star },
  { href: "/dashboard/history", label: "История", icon: History },
  { href: "/dashboard/settings", label: "Настройки", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-card p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">ProStore</h2>
        <p className="text-sm text-muted-foreground">Управление промтами</p>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

