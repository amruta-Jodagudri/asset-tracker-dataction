import type React from "react"
import AdminSidebar from "./admin-sidebar"
import AdminNavbar from "./admin-navbar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="bg-background">
      <AdminSidebar />
      <AdminNavbar />
      <main className="ml-64 mt-16 p-6">{children}</main>
    </div>
  )
}
