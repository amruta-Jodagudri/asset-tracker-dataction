"use client"

import type React from "react"

import { useAuth } from "@/lib/context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { mockAssets } from "@/lib/mock-data"
import { TableSearchSort } from "@/components/table-search-sort"

export default function ReturnAssetPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [assets, setAssets] = useState(mockAssets)
  const [filteredAssets, setFilteredAssets] = useState(mockAssets)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<(typeof mockAssets)[0] | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAssetForm, setNewAssetForm] = useState({
    assetId: "",
    name: "",
    category: "",
    model: "",
    configuration: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyExpiry: "",
    status: "available",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [sortKey, setSortKey] = useState("assetId")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  useEffect(() => {
    let result = assets

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
        case "status":
          aVal = a.status
          bVal = b.status
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
  }, [assets, searchTerm, sortKey, sortOrder])

  if (!user) return null

  const handleEdit = (asset: (typeof mockAssets)[0]) => {
    setEditingId(asset.id)
    setEditForm({ ...asset })
  }

  const handleSaveEdit = () => {
    if (editForm) {
      setAssets(assets.map((a) => (a.id === editForm.id ? editForm : a)))
      setEditingId(null)
      setEditForm(null)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      setAssets(assets.filter((a) => a.id !== id))
    }
  }

  const handleAddAsset = () => {
    if (!newAssetForm.assetId || !newAssetForm.name) {
      alert("Asset ID and Name are required")
      return
    }

    const newAsset: (typeof mockAssets)[0] = {
      id: String(assets.length + 1),
      ...newAssetForm,
    }

    setAssets([...assets, newAsset])
    setShowAddForm(false)
    setNewAssetForm({
      assetId: "",
      name: "",
      category: "",
      model: "",
      configuration: "",
      serialNumber: "",
      purchaseDate: "",
      warrantyExpiry: "",
      status: "available",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (editForm) {
      setEditForm({ ...editForm, [name]: value })
    }
  }

  const handleNewAssetInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewAssetForm({ ...newAssetForm, [name]: value })
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "allocated":
        return "bg-green-100 text-green-700"
      case "available":
        return "bg-blue-100 text-blue-700"
      case "under_repair":
        return "bg-red-100 text-red-700"
      case "returned":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Return/Store Asset</h1>
            <p className="text-muted-foreground mt-1">Manage all assets in inventory</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all font-medium"
          >
            + Add Asset
          </button>
        </div>

        {/* Search and Sort */}
        <TableSearchSort
          onSearchChange={setSearchTerm}
          onSortChange={(key, order) => {
            setSortKey(key)
            setSortOrder(order)
          }}
          searchPlaceholder="Search by Asset ID, Name, Category, or Model..."
          sortOptions={[
            { key: "assetId", label: "Asset ID" },
            { key: "name", label: "Asset Name" },
            { key: "category", label: "Category" },
            { key: "status", label: "Status" },
          ]}
        />

        {/* Assets Table */}
        <div className="bg-card rounded-lg shadow border border-border p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-left text-muted-foreground">
                <th className="pb-3 font-semibold">Asset ID</th>
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Model</th>
                <th className="pb-3 font-semibold">Serial Number</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="border-b border-border hover:bg-secondary transition-colors">
                  <td className="py-3">{asset.assetId}</td>
                  <td className="py-3">{asset.name}</td>
                  <td className="py-3">{asset.category}</td>
                  <td className="py-3">{asset.model}</td>
                  <td className="py-3 text-xs text-muted-foreground">{asset.serialNumber}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(asset.status)}`}>
                      {asset.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 space-x-2">
                    <button
                      onClick={() => handleEdit(asset)}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:opacity-90"
                    >
                      View/Edit
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-xs font-medium hover:opacity-90"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAssets.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">No assets found matching your search criteria.</div>
          )}
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">Add New Asset</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Asset ID *</label>
                    <input
                      type="text"
                      name="assetId"
                      value={newAssetForm.assetId}
                      onChange={handleNewAssetInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., ASSET005"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={newAssetForm.name}
                      onChange={handleNewAssetInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Dell Laptop"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={newAssetForm.category}
                      onChange={handleNewAssetInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Computers"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Model</label>
                    <input
                      type="text"
                      name="model"
                      value={newAssetForm.model}
                      onChange={handleNewAssetInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., XPS 13"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Serial Number</label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={newAssetForm.serialNumber}
                      onChange={handleNewAssetInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., SN123456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Configuration</label>
                    <input
                      type="text"
                      name="configuration"
                      value={newAssetForm.configuration}
                      onChange={handleNewAssetInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., i7, 16GB RAM, 512GB SSD"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Purchase Date</label>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={newAssetForm.purchaseDate}
                      onChange={handleNewAssetInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Warranty Expiry</label>
                    <input
                      type="date"
                      name="warrantyExpiry"
                      value={newAssetForm.warrantyExpiry}
                      onChange={handleNewAssetInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                    <select
                      name="status"
                      value={newAssetForm.status}
                      onChange={handleNewAssetInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="available">Available</option>
                      <option value="allocated">Allocated</option>
                      <option value="under_repair">Under Repair</option>
                      <option value="returned">Returned</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAsset}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all"
                  >
                    Add Asset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingId && editForm && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">Edit Asset</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Asset ID</label>
                  <input
                    type="text"
                    name="assetId"
                    value={editForm.assetId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={editForm.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={editForm.model}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="available">Available</option>
                    <option value="allocated">Allocated</option>
                    <option value="under_repair">Under Repair</option>
                    <option value="returned">Returned</option>
                  </select>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setEditingId(null)
                      setEditForm(null)
                    }}
                    className="flex-1 px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
