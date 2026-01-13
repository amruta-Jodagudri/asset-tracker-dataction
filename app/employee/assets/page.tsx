"use client"

import { useAuth } from "@/lib/context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import EmployeeLayout from "@/components/employee-layout"
import { mockAssets, mockAllocations } from "@/lib/mock-data"
import { TableSearchSort } from "@/components/table-search-sort"

export default function EmployeeAssetsInventory() {
  const { user } = useAuth()
  const router = useRouter()
  const [assets, setAssets] = useState(mockAssets)
  const [filteredAssets, setFilteredAssets] = useState<typeof mockAssets>([])
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [showAcknowledgment, setShowAcknowledgment] = useState(false)
  const [formData, setFormData] = useState({
    selfie: null as File | null,
    idProof: null as File | null,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [sortKey, setSortKey] = useState("assetId")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    if (!user || user.role !== "employee") {
      router.push("/")
    }
  }, [user, router])

  useEffect(() => {
    if (!user) return

    let result = assets.filter((a) => a.allocatedTo === user.employeeId)

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (asset) =>
          asset.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.model.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply sorting
    result = result.sort((a, b) => {
      let aVal: string | number = ""
      let bVal: string | number = ""

      switch (sortKey) {
        case "assetId":
          aVal = a.assetId
          bVal = b.assetId
          break
        case "name":
          aVal = a.name
          bVal = b.name
          break
        case "category":
          aVal = a.category
          bVal = b.category
          break
        default:
          aVal = a.assetId
          bVal = b.assetId
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

    setFilteredAssets(result)
  }, [assets, user, searchTerm, sortKey, sortOrder])

  if (!user) return null

  const handleAcknowledge = (assetId: string) => {
    setSelectedAsset(assetId)
    setShowAcknowledgment(true)
  }

  const handleSubmitAcknowledgment = () => {
    if (!selectedAsset || !formData.selfie || !formData.idProof) {
      alert("Please upload both selfie and ID proof")
      return
    }

    // Update asset status to approved
    setAssets(assets.map((asset) => (asset.id === selectedAsset ? { ...asset } : asset)))

    // Reset form
    setShowAcknowledgment(false)
    setFormData({ selfie: null, idProof: null })
    setSelectedAsset(null)
    alert("Asset acknowledged successfully!")
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assets Inventory</h1>
          <p className="text-muted-foreground mt-1">Your allocated assets requiring acknowledgment</p>
        </div>

        {/* Search and Sort */}
        <TableSearchSort
          onSearchChange={setSearchTerm}
          onSortChange={(key, order) => {
            setSortKey(key)
            setSortOrder(order)
          }}
          searchPlaceholder="Search by Asset ID, Name, or Category..."
          sortOptions={[
            { key: "assetId", label: "Asset ID" },
            { key: "name", label: "Asset Name" },
            { key: "category", label: "Category" },
          ]}
        />

        {/* Assets Table */}
        <div className="bg-card rounded-lg shadow border border-border p-6">
          {filteredAssets.length === 0 ? (
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
                    <th className="pb-3 font-semibold">Configuration</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => {
                    const allocation = mockAllocations.find((a) => a.assetId === asset.id)
                    const isPending = allocation?.status === "pending"

                    return (
                      <tr key={asset.id} className="border-b border-border hover:bg-secondary transition-colors">
                        <td className="py-3">{asset.assetId}</td>
                        <td className="py-3">{asset.name}</td>
                        <td className="py-3">{asset.category}</td>
                        <td className="py-3">{asset.model}</td>
                        <td className="py-3 text-xs text-muted-foreground">{asset.configuration}</td>
                        <td className="py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isPending ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                            }`}
                          >
                            {isPending ? "Pending" : "Approved"}
                          </span>
                        </td>
                        <td className="py-3">
                          {isPending && (
                            <button
                              onClick={() => handleAcknowledge(asset.id)}
                              className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:opacity-90"
                            >
                              Acknowledge
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Acknowledgment Modal */}
        {showAcknowledgment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-foreground mb-4">Acknowledge Asset</h2>
              <p className="text-muted-foreground mb-6">Please upload your selfie and ID proof for verification</p>

              <div className="space-y-4">
                {/* Selfie Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Selfie</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        selfie: e.target.files?.[0] || null,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formData.selfie && <p className="text-xs text-green-600 mt-1">{formData.selfie.name}</p>}
                </div>

                {/* ID Proof Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">ID Proof</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        idProof: e.target.files?.[0] || null,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formData.idProof && <p className="text-xs text-green-600 mt-1">{formData.idProof.name}</p>}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAcknowledgment(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitAcknowledgment}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  )
}
