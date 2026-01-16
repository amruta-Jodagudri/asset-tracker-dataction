"use client"

import { useAuth } from "@/lib/context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { TableSearchSort } from "@/components/table-search-sort"
import Link from "next/link"
import { 
  mockLaptopAllocations, 
  mockMobileAllocations, 
  mockMonitorAllocations,
  type LaptopAllocation,
  type MobileAllocation,
  type MonitorAllocation 
} from "@/lib/mock-data"
import ViewAllocationModal from "@/components/view-allocation-modal"
import { Edit2, Eye, Trash2, ChevronDown, ChevronUp, Download } from "lucide-react"

type AssetType = "laptop" | "mobile" | "monitor"

export default function AdminAssetsInventory() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<AssetType>("laptop")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortKey, setSortKey] = useState("allocationDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedAllocation, setSelectedAllocation] = useState<any>(null)
  const [selectedType, setSelectedType] = useState<AssetType>("laptop")
  
  // Separate states for each type of allocation
  const [laptopAllocations, setLaptopAllocations] = useState<LaptopAllocation[]>(mockLaptopAllocations)
  const [mobileAllocations, setMobileAllocations] = useState<MobileAllocation[]>(mockMobileAllocations)
  const [monitorAllocations, setMonitorAllocations] = useState<MonitorAllocation[]>(mockMonitorAllocations)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  // Filter and sort logic
  useEffect(() => {
    const filterAndSort = <T extends { 
      empId: string; 
      empName: string; 
      businessArea: string;
      allocationDate: string;
      status: string;
    }>(allocations: T[], getSortValue: (item: T) => string | number) => {
      let result = [...allocations]

      // Apply search filter
      if (searchTerm) {
        result = result.filter(
          (item) =>
            item.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.businessArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.status.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // Apply sorting
      result = result.sort((a, b) => {
        let aVal = getSortValue(a)
        let bVal = getSortValue(b)

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

      return result
    }

    switch (activeTab) {
      case "laptop":
        const sortedLaptops = filterAndSort(laptopAllocations, (item) => {
          switch (sortKey) {
            case "empName": return item.empName
            case "laptopSrNo": return item.laptopSrNo
            case "allocationDate": return item.allocationDate
            case "status": return item.status
            default: return item.allocationDate
          }
        })
        setLaptopAllocations(sortedLaptops)
        break

      case "mobile":
        const sortedMobiles = filterAndSort(mobileAllocations, (item) => {
          switch (sortKey) {
            case "empName": return item.empName
            case "mobileSrNo": return item.mobileSrNo
            case "allocationDate": return item.allocationDate
            case "status": return item.status
            default: return item.allocationDate
          }
        })
        setMobileAllocations(sortedMobiles)
        break

      case "monitor":
        const sortedMonitors = filterAndSort(monitorAllocations, (item) => {
          switch (sortKey) {
            case "empName": return item.empName
            case "monitorSrNo": return item.monitorSrNo
            case "allocationDate": return item.allocationDate
            case "status": return item.status
            default: return item.allocationDate
          }
        })
        setMonitorAllocations(sortedMonitors)
        break
    }
  }, [searchTerm, sortKey, sortOrder, activeTab])

  if (!user) return null

  // Handle allocation actions
  const handleEdit = (id: string, type: AssetType) => {
    router.push(`/admin/allocation?edit=${id}&type=${type}`)
  }

  const handleView = (id: string, type: AssetType) => {
    let data = null
    switch (type) {
      case "laptop":
        data = laptopAllocations.find(item => item.id === id)
        break
      case "mobile":
        data = mobileAllocations.find(item => item.id === id)
        break
      case "monitor":
        data = monitorAllocations.find(item => item.id === id)
        break
    }
    
    if (data) {
      setSelectedAllocation(data)
      setSelectedType(type)
      setViewModalOpen(true)
    }
  }

  const handleDownload = (id: string, type: AssetType) => {
    // In a real app, this would generate and download a PDF
    console.log(`Download ${type} allocation: ${id}`)
    alert(`Downloading ${type} allocation form for ID: ${id}`)
  }

  const handleDelete = (id: string, type: AssetType) => {
    if (confirm("Are you sure you want to delete this allocation?")) {
      switch (type) {
        case "laptop":
          setLaptopAllocations(prev => prev.filter(item => item.id !== id))
          break
        case "mobile":
          setMobileAllocations(prev => prev.filter(item => item.id !== id))
          break
        case "monitor":
          setMonitorAllocations(prev => prev.filter(item => item.id !== id))
          break
      }
    }
  }

  return (
    <AdminLayout>
      {/* Global scrollbar styles */}
      <style jsx global>{`
        /* Custom scrollbar for the entire page */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 5px;
          border: 2px solid #f1f5f9;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        ::-webkit-scrollbar-corner {
          background: #f1f5f9;
        }

        /* For Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
      `}</style>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assets Inventory</h1>
            <p className="text-gray-600 mt-1">Manage and track all allocated assets</p>
          </div>
          <Link
            href="/admin/allocation"
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Allocate Asset
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className={`bg-white rounded-lg border p-6 cursor-pointer transition-all ${activeTab === 'laptop' ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
            onClick={() => setActiveTab("laptop")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Laptop & Accessories</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{laptopAllocations.length}</p>
              </div>
              <div className={`p-3 rounded-full ${activeTab === 'laptop' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {laptopAllocations.filter(a => a.status === "Active").length} Active
            </p>
          </div>

          <div 
            className={`bg-white rounded-lg border p-6 cursor-pointer transition-all ${activeTab === 'mobile' ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
            onClick={() => setActiveTab("mobile")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mobile Devices</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{mobileAllocations.length}</p>
              </div>
              <div className={`p-3 rounded-full ${activeTab === 'mobile' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {mobileAllocations.filter(a => a.status === "Active").length} Active
            </p>
          </div>

          <div 
            className={`bg-white rounded-lg border p-6 cursor-pointer transition-all ${activeTab === 'monitor' ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
            onClick={() => setActiveTab("monitor")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monitors</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{monitorAllocations.length}</p>
              </div>
              <div className={`p-3 rounded-full ${activeTab === 'monitor' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {monitorAllocations.filter(a => a.status === "Active").length} Active
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Search and Controls */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by EMP ID, Name, Business Area, or Status..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="allocationDate">Sort by Date</option>
                  <option value="empName">Sort by Name</option>
                  <option value="status">Sort by Status</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {sortOrder === "asc" ? (
                    <ChevronUp className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Custom scrollbar styles for tables */}
          <style>{`
            .table-scroll {
              overflow-x: auto;
              position: relative;
            }
            
            .table-scroll::-webkit-scrollbar {
              height: 8px;
            }
            
            .table-scroll::-webkit-scrollbar-track {
              background: #f9fafb;
              border-radius: 4px;
              margin: 0 6px;
            }
            
            .table-scroll::-webkit-scrollbar-thumb {
              background: #d1d5db;
              border-radius: 4px;
              border: 2px solid #f9fafb;
            }
            
            .table-scroll::-webkit-scrollbar-thumb:hover {
              background: #9ca3af;
            }
            
            .table-scroll::-webkit-scrollbar-button {
              display: none;
            }
            
            /* Custom scrollbar for Firefox tables */
            .table-scroll {
              scrollbar-width: thin;
              scrollbar-color: #d1d5db #f9fafb;
            }
          `}</style>

          {/* Laptop & Accessories Table */}
          {activeTab === "laptop" && (
            <div className="table-scroll">
              <table className="w-full min-w-[1200px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMP ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMP Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Area</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laptop Sr. No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laptop Ownership</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Configuration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charger</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bag</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {laptopAllocations.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="mt-2 text-sm font-medium">No laptop allocations found</p>
                          <p className="text-sm">Try adjusting your search or filter</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    laptopAllocations.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.empId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.empName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.businessArea}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{item.laptopSrNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.laptopOwnership === 'Company' ? 'bg-blue-100 text-blue-800' :
                            item.laptopOwnership === 'Employee' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.laptopOwnership}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.makeModel}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">{item.configuration}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.charger === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.charger}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.bag === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.bag}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.allocationDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            item.status === "Active" ? "bg-green-100 text-green-800" :
                            item.status === "Returned" ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEdit(item.id, "laptop")}
                              className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleView(item.id, "laptop")}
                              className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(item.id, "laptop")}
                              className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                              title="Download Form"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, "laptop")}
                              className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile Devices Table */}
          {activeTab === "mobile" && (
            <div className="table-scroll">
              <table className="w-full min-w-[1400px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMP ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMP Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Area</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Sr. No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMEI No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charger</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charger Sr. No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Back Cover</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIM Card</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIM Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mobileAllocations.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <p className="mt-2 text-sm font-medium">No mobile allocations found</p>
                          <p className="text-sm">Try adjusting your search or filter</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    mobileAllocations.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.empId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.empName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.businessArea}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{item.mobileSrNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{item.imeiNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.makeModel}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.charger === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.charger}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{item.chargerSrNo || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.backCover === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.backCover}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.simCard === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.simCard}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{item.simNumber || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.allocationDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            item.status === "Active" ? "bg-green-100 text-green-800" :
                            item.status === "Returned" ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEdit(item.id, "mobile")}
                              className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleView(item.id, "mobile")}
                              className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(item.id, "mobile")}
                              className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                              title="Download Form"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, "mobile")}
                              className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Monitors Table */}
          {activeTab === "monitor" && (
            <div className="table-scroll">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMP ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMP Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Area</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monitor Sr. No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Power Cable</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HDMI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {monitorAllocations.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                          </svg>
                          <p className="mt-2 text-sm font-medium">No monitor allocations found</p>
                          <p className="text-sm">Try adjusting your search or filter</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    monitorAllocations.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.empId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.empName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.businessArea}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{item.monitorSrNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.makeModel}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.powerCable === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.powerCable}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.hdmi === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.hdmi}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.allocationDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            item.status === "Active" ? "bg-green-100 text-green-800" :
                            item.status === "Returned" ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEdit(item.id, "monitor")}
                              className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleView(item.id, "monitor")}
                              className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(item.id, "monitor")}
                              className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                              title="Download Form"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, "monitor")}
                              className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {(
            (activeTab === "laptop" && laptopAllocations.length > 0) ||
            (activeTab === "mobile" && mobileAllocations.length > 0) ||
            (activeTab === "monitor" && monitorAllocations.length > 0)
          ) && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">
                  {activeTab === "laptop" ? laptopAllocations.length :
                   activeTab === "mobile" ? mobileAllocations.length :
                   monitorAllocations.length}
                </span> of{' '}
                <span className="font-medium">
                  {activeTab === "laptop" ? laptopAllocations.length :
                   activeTab === "mobile" ? mobileAllocations.length :
                   monitorAllocations.length}
                </span> entries
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      <ViewAllocationModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false)
          setSelectedAllocation(null)
        }}
        type={selectedType}
        data={selectedAllocation}
      />
    </AdminLayout>
  )
}