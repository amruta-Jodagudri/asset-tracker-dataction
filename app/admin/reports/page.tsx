"use client"

import type React from "react"

import { useAuth } from "@/lib/context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { mockAssets, mockAllocations, mockEmployees } from "@/lib/mock-data"
import {
  exportTotalAssetReport,
  exportAllocatedVsAvailable,
  exportEmployeeWiseAssets,
  exportWarrantyExpiry,
  exportAssetRental,
} from "@/lib/excel-export"
import { BarChart3, FileText, TrendingUp, AlertCircle, Users } from "lucide-react"

export default function ITReportsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [assets] = useState(mockAssets)

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

  // Warranty expiry
  const today = new Date()
  const expiringWarranties = assets.filter((a) => {
    const expiryDate = new Date(a.warrantyExpiry)
    const daysUntil = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntil < 90 && daysUntil > 0
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">IT Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and export asset reports</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        {/* Warning - Expiring Warranties */}
        {expiringWarranties.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Warranty Expiry Alert</h3>
                <p className="text-sm text-yellow-700">
                  {expiringWarranties.length} asset(s) have warranties expiring within 90 days
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reports Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Asset Report */}
          <ReportCard
            title="Total Asset Report"
            description="Complete inventory of all assets with details"
            icon={<FileText size={24} className="text-primary" />}
            onExport={() => exportTotalAssetReport(assets)}
          />

          {/* Allocated vs Available */}
          <ReportCard
            title="Allocated vs Available"
            description="Asset distribution across different statuses"
            icon={<TrendingUp size={24} className="text-primary" />}
            onExport={() => exportAllocatedVsAvailable(assets)}
          />

          {/* Employee-wise Assets */}
          <ReportCard
            title="Employee-wise Assets"
            description="Assets breakdown by employee"
            icon={<Users size={24} className="text-primary" />}
            onExport={() => exportEmployeeWiseAssets(assets, mockAllocations, mockEmployees)}
          />

          {/* Warranty Expiry */}
          <ReportCard
            title="Warranty Expiry"
            description="Assets warranty status and expiry dates"
            icon={<AlertCircle size={24} className="text-primary" />}
            onExport={() => exportWarrantyExpiry(assets)}
          />

          {/* Asset Rental */}
          <ReportCard
            title="Asset Rental (Inward/Outward)"
            description="Temporary loans and rental assets"
            icon={<BarChart3 size={24} className="text-primary" />}
            onExport={() => exportAssetRental(assets)}
          />
        </div>

        {/* Sample Report Table */}
        <div className="bg-card rounded-lg shadow border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Asset Status Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Allocated</p>
              <p className="text-2xl font-bold text-blue-700 mt-2">{allocated}</p>
              <p className="text-xs text-blue-600 mt-1">({((allocated / totalAssets) * 100).toFixed(1)}%)</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Available</p>
              <p className="text-2xl font-bold text-green-700 mt-2">{available}</p>
              <p className="text-xs text-green-600 mt-1">({((available / totalAssets) * 100).toFixed(1)}%)</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Under Repair</p>
              <p className="text-2xl font-bold text-red-700 mt-2">{underRepair}</p>
              <p className="text-xs text-red-600 mt-1">({((underRepair / totalAssets) * 100).toFixed(1)}%)</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Total</p>
              <p className="text-2xl font-bold text-gray-700 mt-2">{totalAssets}</p>
              <p className="text-xs text-gray-600 mt-1">100%</p>
            </div>
          </div>
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
