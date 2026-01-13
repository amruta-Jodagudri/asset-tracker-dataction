"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, User, LogOut } from "lucide-react"
import { useAuth } from "@/lib/context"
import { useRouter } from "next/navigation"

const menuItems = [
  {
    label: "Dashboard",
    href: "/employee/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Assets Inventory",
    href: "/employee/assets",
    icon: Package,
  },
  {
    label: "Profile",
    href: "/employee/profile",
    icon: User,
  },
]

export default function EmployeeSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border shadow-lg z-40">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-foreground">Asset Tracker</h1>
        <p className="text-xs text-sidebar-accent-foreground mt-1">Employee</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-md bg-destructive text-destructive-foreground hover:opacity-90 transition-all text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
