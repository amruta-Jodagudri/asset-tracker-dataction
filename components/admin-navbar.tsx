"use client"

import { useState } from "react"
import { useAuth } from "@/lib/context"
import { useRouter } from "next/navigation"

export default function AdminNavbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleProfile = () => {
    router.push("/admin/profile")
    setIsDropdownOpen(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <nav className="fixed top-0 right-0 left-64 h-16 bg-card border-b border-border shadow-sm z-30 flex items-center justify-end px-6">
      {/* Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 hover:bg-secondary rounded-md p-2 transition-all"
        >
          {user?.profileImage && (
            <img
              src={user.profileImage || "/placeholder.svg"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.designation}</p>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-50">
            <button
              onClick={handleProfile}
              className="w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm hover:bg-secondary border-t border-border text-destructive transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
