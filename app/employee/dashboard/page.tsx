"use client"

import { useAuth } from "@/lib/context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import EmployeeLayout from "@/components/employee-layout"
import { mockAssets } from "@/lib/mock-data"

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "employee") {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  // Get assets allocated to this employee
  const employeeAssets = mockAssets.filter((a) => a.allocatedTo === user.employeeId)
  const totalAssets = employeeAssets.length
  const availableAssets = employeeAssets.filter((a) => a.status === "available").length

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatsCard title="Total Assets" value={totalAssets} />
          <StatsCard title="Available Assets" value={availableAssets} />
        </div>

        {/* Assets Inventory */}
        <div className="bg-card rounded-lg shadow border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Your Assets Inventory</h2>
          {employeeAssets.length === 0 ? (
            <p className="text-muted-foreground">No assets allocated to you yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr className="text-left text-muted-foreground">
                    <th className="pb-3 font-semibold">Asset ID</th>
                    <th className="pb-3 font-semibold">Name</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Model</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Allocation Date</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeAssets.map((asset) => (
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
                      <td className="py-3">{asset.allocationDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </EmployeeLayout>
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
