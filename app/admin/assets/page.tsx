"use client"

import { useAuth } from "@/lib/context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { mockAssets, mockAllocations, mockEmployees } from "@/lib/mock-data"
import { TableSearchSort } from "@/components/table-search-sort"

export default function AdminAssetsInventory() {
  const { user } = useAuth()
  const router = useRouter()
  const [filteredAllocations, setFilteredAllocations] = useState(mockAllocations)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortKey, setSortKey] = useState("allocationDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  useEffect(() => {
    let result = mockAllocations.map((allocation) => {
      const asset = mockAssets.find((a) => a.id === allocation.assetId)
      const employee = mockEmployees.find((e) => e.employeeId === allocation.employeeId)
      return { ...allocation, asset, employee }
    })

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.asset?.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.asset?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.employee?.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.status.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply sorting
    result = result.sort((a, b) => {
      let aVal: string | number = ""
      let bVal: string | number = ""

      switch (sortKey) {
        case "assetId":
          aVal = a.asset?.assetId || ""
          bVal = b.asset?.assetId || ""
          break
        case "employeeName":
          aVal = a.employee?.name || ""
          bVal = b.employee?.name || ""
          break
        case "allocationDate":
          aVal = a.allocationDate
          bVal = b.allocationDate
          break
        case "status":
          aVal = a.status
          bVal = b.status
          break
        default:
          aVal = a.allocationDate
          bVal = b.allocationDate
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase()
        bVal = (bVal as string).toLowerCase()
      }

      if (sortOrder === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

    setFilteredAllocations(result)
  }, [searchTerm, sortKey, sortOrder])

  if (!user) return null

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assets Inventory</h1>
          <p className="text-muted-foreground mt-1">All allocated assets and their acknowledgment status</p>
        </div>

        {/* Search and Sort */}
        <TableSearchSort
          onSearchChange={setSearchTerm}
          onSortChange={(key, order) => {
            setSortKey(key)
            setSortOrder(order)
          }}
          searchPlaceholder="Search by Asset ID, Employee ID, Name, or Status..."
          sortOptions={[
            { key: "assetId", label: "Asset ID" },
            { key: "employeeName", label: "Employee Name" },
            { key: "allocationDate", label: "Allocation Date" },
            { key: "status", label: "Status" },
          ]}
        />

        {/* Assets Table */}
        <div className="bg-card rounded-lg shadow border border-border p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-left text-muted-foreground">
                <th className="pb-3 font-semibold">Asset ID</th>
                <th className="pb-3 font-semibold">Asset Name</th>
                <th className="pb-3 font-semibold">Employee ID</th>
                <th className="pb-3 font-semibold">Employee Name</th>
                <th className="pb-3 font-semibold">Model</th>
                <th className="pb-3 font-semibold">Allocation Date</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAllocations.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-secondary transition-colors">
                  <td className="py-3">{item.asset?.assetId}</td>
                  <td className="py-3">{item.asset?.name}</td>
                  <td className="py-3">{item.employee?.employeeId}</td>
                  <td className="py-3">{item.employee?.name}</td>
                  <td className="py-3 text-xs text-muted-foreground">{item.asset?.model}</td>
                  <td className="py-3">{item.allocationDate}</td>
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAllocations.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No allocations found matching your search criteria.
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-6 border border-border">
            <p className="text-sm font-medium text-foreground">Total Allocations</p>
            <p className="text-3xl font-bold text-primary mt-2">{filteredAllocations.length}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-border">
            <p className="text-sm font-medium text-foreground">Approved</p>
            <p className="text-3xl font-bold text-primary mt-2">
              {filteredAllocations.filter((a) => a.status === "approved").length}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
