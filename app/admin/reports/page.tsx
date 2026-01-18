"use client"

import type React from "react"

import { useAuth } from "@/lib/context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { mockAssets, mockAllocations, mockEmployees } from "@/lib/mock-data"
import {
  exportTotalAssetReport,
  exportEmployeeWiseAssets,
  exportAssetRental,
} from "@/lib/excel-export"
import { BarChart3, FileText, TrendingUp, AlertCircle, Users, Eye, Edit, Trash2, Download } from "lucide-react"

export default function ITReportsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [assets] = useState(mockAssets)
  const [employees, setEmployees] = useState(() => 
    mockEmployees.map(emp => ({
      ...emp,
      // Generate usernames from email
      username: emp.email.split('@')[0],
      // Add mock passwords
      password: `${emp.employeeId.toLowerCase()}123`
    }))
  )
  const [showPassword, setShowPassword] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  // Calculate stats
  const totalAssets = assets.length
  const allocated = assets.filter((a) => a.status === "allocated").length
  const available = assets.filter((a) => a.status === "available").length
  const underRepair = assets.filter((a) => a.status === "under_repair").length

  // Mock rental counts
  const ivmRentals = 512
  const zmRentals = 118

  // Handle password visibility toggle
  const togglePasswordVisibility = (empId: string) => {
    setShowPassword(prev => ({
      ...prev,
      [empId]: !prev[empId]
    }))
  }

  // Handle employee actions
  const handleViewEmployee = (empId: string) => {
    const employee = employees.find(emp => emp.id === empId)
    console.log("View employee:", employee)
    // Implement view logic - open modal or navigate to employee details
    alert(`View employee: ${employee?.name}\nEMP ID: ${employee?.employeeId}\nDesignation: ${employee?.designation}`)
  }

  const handleEditEmployee = (empId: string) => {
    const employee = employees.find(emp => emp.id === empId)
    console.log("Edit employee:", employee)
    // Implement edit logic - open edit modal
    const newUsername = prompt("Enter new username:", employee?.username || "")
    if (newUsername) {
      setEmployees(prev => prev.map(emp => 
        emp.id === empId ? { ...emp, username: newUsername } : emp
      ))
    }
  }

  const handleDeleteEmployee = (empId: string) => {
    const employee = employees.find(emp => emp.id === empId)
    if (employee && window.confirm(`Are you sure you want to delete employee ${employee.name} (${employee.employeeId})?`)) {
      setEmployees(prev => prev.filter(emp => emp.id !== empId))
      alert(`Employee ${employee.name} has been deleted successfully.`)
    }
  }

  // Export employee list
  const exportEmployeeList = () => {
    // Create CSV content
    const headers = ["EMP ID", "Employee Name", "Designation", "Department", "Email", "Username", "Status"]
    const csvContent = [
      headers.join(","),
      ...employees.map(emp => [
        emp.employeeId,
        `"${emp.name}"`,
        `"${emp.designation}"`,
        `"${emp.department}"`,
        emp.email,
        emp.username,
        "Active"
      ].join(","))
    ].join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `Employee_List_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Format password display
  const getPasswordDisplay = (empId: string, password: string) => {
    return showPassword[empId] ? password : "••••••••"
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">IT Reports</h1>
          <p className="text-muted-foreground mt-2">Generate and export various IT reports</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Assets</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">{totalAssets}</p>
              </div>
              <BarChart3 size={32} className="text-blue-400" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Allocated</p>
                <p className="text-3xl font-bold text-green-700 mt-2">{allocated}</p>
              </div>
              <Users size={32} className="text-green-400" />
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Available</p>
                <p className="text-3xl font-bold text-orange-700 mt-2">{available}</p>
              </div>
              <TrendingUp size={32} className="text-orange-400" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Under Repair</p>
                <p className="text-3xl font-bold text-red-700 mt-2">{underRepair}</p>
              </div>
              <AlertCircle size={32} className="text-red-400" />
            </div>
          </div>
        </div>

        {/* Rental Assets Summary Section */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Rental Assets Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">IVM Rentals</p>
                  <p className="text-3xl font-bold text-purple-700 mt-2">{ivmRentals}</p>
                  <p className="text-xs text-muted-foreground mt-1">Active rental assets</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <BarChart3 size={28} className="text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg p-6 border border-cyan-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-cyan-600">ZM Rentals</p>
                  <p className="text-3xl font-bold text-cyan-700 mt-2">{zmRentals}</p>
                  <p className="text-xs text-muted-foreground mt-1">Active rental assets</p>
                </div>
                <div className="bg-cyan-100 p-3 rounded-full">
                  <TrendingUp size={28} className="text-cyan-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Asset Report */}
          <ReportCard
            title="Total Asset Report"
            description="Complete inventory of all assets with details"
            icon={<FileText size={24} className="text-primary" />}
            onExport={() => exportTotalAssetReport(assets)}
          />

          {/* Employee-wise Assets */}
          <ReportCard
            title="Employee-wise Assets"
            description="Assets breakdown by employee"
            icon={<Users size={24} className="text-primary" />}
            onExport={() => exportEmployeeWiseAssets(assets, mockAllocations, mockEmployees)}
          />

          {/* Asset Rental */}
          <ReportCard
            title="Asset Rental (Inward/Outward)"
            description="Temporary loans and rental assets"
            icon={<BarChart3 size={24} className="text-primary" />}
            onExport={() => exportAssetRental(assets)}
          />
        </div>

        {/* Active Users List Section */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Active Users</h2>
              <p className="text-sm text-muted-foreground mt-1">
                List of onboarded employees with system access
              </p>
            </div>
            <button
              onClick={exportEmployeeList}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all font-medium flex items-center gap-2"
            >
              <Download size={16} />
              Export List
            </button>
          </div>

          {employees.length === 0 ? (
            <div className="text-center py-8 border border-gray-200 rounded-lg">
              <p className="text-gray-500">No employees found.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        EMP ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Designation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Password
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.employeeId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-xs text-gray-500">{employee.department}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.designation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-700">{employee.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <span className="font-mono">
                              {getPasswordDisplay(employee.id, employee.password)}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(employee.id)}
                              className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {showPassword[employee.id] ? "Hide" : "Show"}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewEmployee(employee.id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEditEmployee(employee.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              title="Edit Employee"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete Employee"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Showing {employees.length} employees
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

interface ReportCardProps {
  title: string
  description: string
  icon: React.ReactNode
  onExport: () => void
}

function ReportCard({ title, description, icon, onExport }: ReportCardProps) {
  return (
    <div className="bg-card rounded-lg shadow border border-border p-6 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        {icon}
      </div>

      <button
        onClick={onExport}
        className="mt-auto px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all font-medium self-start"
      >
        Export to Excel
      </button>
    </div>
  )
}