"use client"

import { useAuth } from "@/lib/context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { mockAssets } from "@/lib/mock-data"

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  // Calculate stats
  const totalAssets = mockAssets.length
  const allocatedAssets = mockAssets.filter((a) => a.status === "allocated").length
  const availableAssets = mockAssets.filter((a) => a.status === "available").length
  const underRepair = mockAssets.filter((a) => a.status === "under_repair").length

  const recentAssets = mockAssets.slice(-3).reverse()

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Assets" value={totalAssets} />
          <StatsCard title="Allocated" value={allocatedAssets} />
          <StatsCard title="Available" value={availableAssets} />
          <StatsCard title="Under Repair" value={underRepair} />
        </div>

        {/* Recent Assets */}
        <div className="bg-card rounded-lg shadow border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Assets Inventory</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left text-muted-foreground">
                  <th className="pb-3 font-semibold">Asset ID</th>
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Model</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Allocated To</th>
                </tr>
              </thead>
              <tbody>
                {recentAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-border hover:bg-secondary transition-colors">
                    <td className="py-3">{asset.assetId}</td>
                    <td className="py-3">{asset.name}</td>
                    <td className="py-3">{asset.category}</td>
                    <td className="py-3">{asset.model}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          asset.status === "allocated"
                            ? "bg-green-100 text-green-700"
                            : asset.status === "available"
                              ? "bg-blue-100 text-blue-700"
                              : asset.status === "under_repair"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {asset.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3">{asset.allocatedTo || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

interface StatsCardProps {
  title: string
  value: number
}

function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  )
}
