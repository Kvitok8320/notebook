import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Notebook App',
  description: 'Minimal Next.js + Prisma + NeonDB app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

