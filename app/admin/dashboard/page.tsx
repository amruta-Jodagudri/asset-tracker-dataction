"use client"

import { useAuth } from "@/lib/context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { 
  mockAssets, 
  mockLaptopAllocations, 
  mockMobileAllocations, 
  mockMonitorAllocations, 
  mockAccessoriesAllocations 
} from "@/lib/mock-data"
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line 
} from "recharts"

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'laptop' | 'mobile' | 'monitor' | 'accessories'>('laptop')

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  // Calculate stats for all assets
  const totalAssets = mockAssets.length
  const allocatedAssets = mockAssets.filter((a) => a.status === "allocated").length
  const availableAssets = mockAssets.filter((a) => a.status === "available").length
  const underRepair = mockAssets.filter((a) => a.status === "under_repair").length

  // Calculate laptop-specific data
  const laptopAssets = mockAssets.filter(a => a.category === "Computers")
  const laptopOwnershipData = [
    { name: "IBM Rental", value: 35, color: "#0088FE" },
    { name: "ZM Rental", value: 25, color: "#00C49F" },
    { name: "Client", value: 20, color: "#FFBB28" },
    { name: "Owned", value: 20, color: "#FF8042" },
  ]

  const laptopLocationData = [
    { name: "Allocated", value: 65, color: "#0088FE" },
    { name: "Available", value: 35, color: "#00C49F" },
  ]

  // Get acknowledgement pending data (for all categories)
  const acknowledgementPendingData = [
    {
      empId: "EMP001",
      empName: "John Doe",
      businessArea: "Engineering",
      category: "Laptop",
      allocationDate: "2024-01-15",
      status: "Pending"
    },
    {
      empId: "EMP002",
      empName: "Jane Smith",
      businessArea: "Product Management",
      category: "Mobile",
      allocationDate: "2024-01-12",
      status: "Pending"
    },
    {
      empId: "EMP003",
      empName: "Robert Johnson",
      businessArea: "Design",
      category: "Monitor",
      allocationDate: "2024-01-10",
      status: "Pending"
    },
    {
      empId: "EMP004",
      empName: "Sarah Williams",
      businessArea: "Sales",
      category: "Accessories",
      allocationDate: "2024-01-08",
      status: "Pending"
    },
    {
      empId: "EMP005",
      empName: "Michael Brown",
      businessArea: "Operations",
      category: "Laptop",
      allocationDate: "2024-01-05",
      status: "Pending"
    }
  ]

  // Category-wise counts
  const categoryCounts = [
    { category: "Laptop", allocated: mockLaptopAllocations.filter(l => l.status === 'active').length, total: mockLaptopAllocations.length },
    { category: "Mobile", allocated: mockMobileAllocations.filter(m => m.status === 'active').length, total: mockMobileAllocations.length },
    { category: "Monitor", allocated: mockMonitorAllocations.filter(m => m.status === 'active').length, total: mockMonitorAllocations.length },
    { category: "Accessories", allocated: mockAccessoriesAllocations.filter(a => a.status === 'active').length, total: mockAccessoriesAllocations.length },
  ]

  // Recent activity data
  const recentActivity = [
    { date: "2024-01-15", activity: "Laptop allocated to John Doe", category: "Laptop" },
    { date: "2024-01-14", activity: "Mobile returned by Jane Smith", category: "Mobile" },
    { date: "2024-01-13", activity: "New monitors added to inventory", category: "Monitor" },
    { date: "2024-01-12", activity: "Accessories allocated to Robert Johnson", category: "Accessories" },
    { date: "2024-01-11", activity: "Laptop sent for repair", category: "Laptop" },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Assets" value={totalAssets} />
          <StatsCard title="Allocated" value={allocatedAssets} />
          <StatsCard title="Available" value={availableAssets} />
          <StatsCard title="Under Repair" value={underRepair} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Laptop Ownership Chart */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Laptop Ownership Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={laptopOwnershipData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {laptopOwnershipData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Laptop Location Chart */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Laptop Location Status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={laptopLocationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                  <Legend />
                  <Bar dataKey="value" name="Percentage" fill="#0088FE">
                    {laptopLocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Acknowledgement Pending Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Acknowledgement Pending</h2>
            <p className="text-sm text-gray-600 mt-1">Assets awaiting employee acknowledgement</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EMP ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EMP Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Area
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allocation Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {acknowledgementPendingData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="mt-2 text-sm font-medium">
                          No pending acknowledgements
                        </p>
                        <p className="text-sm">
                          All assets have been acknowledged
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  acknowledgementPendingData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.empId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.empName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.businessArea}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.category === 'Laptop' ? 'bg-blue-100 text-blue-800' :
                          item.category === 'Mobile' ? 'bg-green-100 text-green-800' :
                          item.category === 'Monitor' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.allocationDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {acknowledgementPendingData.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">
                  {acknowledgementPendingData.length}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {acknowledgementPendingData.length}
                </span>{" "}
                entries
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
    </AdminLayout>
  )
}

interface StatsCardProps {
  title: string
  value: number
}

function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  )
}