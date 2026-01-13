"use client"

import type React from "react"

import { useAuth } from "@/lib/context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { mockEmployees } from "@/lib/mock-data"

export default function AllocationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    businessArea: "",
    assetCategory: "",
    assetModel: "",
    configuration: "",
    allocationDate: new Date().toISOString().split("T")[0],
    allocationType: "Permanent",
    remarks: "",
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-fill employee name when employee ID is selected
    if (name === "employeeId") {
      const employee = mockEmployees.find((e) => e.employeeId === value)
      if (employee) {
        setFormData((prev) => ({
          ...prev,
          employeeName: employee.name,
          businessArea: employee.department,
        }))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Asset Allocation</h1>
          <p className="text-muted-foreground mt-1">Allocate assets to employees</p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-lg shadow border border-border p-8 max-w-7xl">
          {submitted && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-md">
              Asset allocated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee Section */}
            <div className="border-b border-border pb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Employee Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Employee ID *</label>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Employee</option>
                    {mockEmployees.map((emp) => (
                      <option key={emp.employeeId} value={emp.employeeId}>
                        {emp.employeeId} - {emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Employee Name</label>
                  <input
                    type="text"
                    value={formData.employeeName}
                    readOnly
                    className="w-full px-4 py-2 border border-border rounded-md bg-secondary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Business Area</label>
                  <input
                    type="text"
                    value={formData.businessArea}
                    readOnly
                    className="w-full px-4 py-2 border border-border rounded-md bg-secondary"
                  />
                </div>
              </div>
            </div>

            {/* Asset Section */}
            <div className="border-b border-border pb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Asset Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Asset Category *</label>
                  <select
                    name="assetCategory"
                    value={formData.assetCategory}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Category</option>
                    <option value="Computers">Computers</option>
                    <option value="Peripherals">Peripherals</option>
                    <option value="Software">Software</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Model *</label>
                  <input
                    type="text"
                    name="assetModel"
                    value={formData.assetModel}
                    onChange={handleInputChange}
                    placeholder="e.g., Dell XPS 13"
                    required
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Configuration *</label>
                  <input
                    type="text"
                    name="configuration"
                    value={formData.configuration}
                    onChange={handleInputChange}
                    placeholder="e.g., i7, 16GB RAM, 512GB SSD"
                    required
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Allocation Section */}
            <div className="border-b border-border pb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Allocation Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Allocation Date *</label>
                  <input
                    type="date"
                    name="allocationDate"
                    value={formData.allocationDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Allocation Type *</label>
                  <select
                    name="allocationType"
                    value={formData.allocationType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Loan">Loan</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    placeholder="Add any additional notes..."
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    employeeId: "",
                    employeeName: "",
                    businessArea: "",
                    assetCategory: "",
                    assetModel: "",
                    configuration: "",
                    allocationDate: new Date().toISOString().split("T")[0],
                    allocationType: "Permanent",
                    remarks: "",
                  })
                }
                className="px-6 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all font-medium"
              >
                Allocate Asset
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
