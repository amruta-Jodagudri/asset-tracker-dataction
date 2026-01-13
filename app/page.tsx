"use client"

import { useAuth } from "@/lib/context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LoginPage from "@/components/login-page"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push(user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard")
    }
  }, [user, router])

  return !user ? <LoginPage /> : null
}
