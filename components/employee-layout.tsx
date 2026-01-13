import type React from "react"
import EmployeeSidebar from "./employee-sidebar"
import EmployeeNavbar from "./employee-navbar"

interface EmployeeLayoutProps {
  children: React.ReactNode
}

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
  return (
    <div className="bg-background">
      <EmployeeSidebar />
      <EmployeeNavbar />
      <main className="ml-64 mt-16 p-6">{children}</main>
    </div>
  )
}
