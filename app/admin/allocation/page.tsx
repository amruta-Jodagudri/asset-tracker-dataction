"use client"

import type React from "react"
import { useAuth } from "@/lib/context"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import AdminLayout from "@/components/admin-layout"

// Main component wrapped in Suspense
export default function AllocationPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AllocationContent />
    </Suspense>
  )
}

// Separate component for the actual content
function AllocationContent() {
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const editType = searchParams.get('type') as CategoryType
  
  const { user } = useAuth()
  const router = useRouter()
  const [category, setCategory] = useState<CategoryType>("")
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Employee Details
  const [empId, setEmpId] = useState("")
  const [empName, setEmpName] = useState("")
  const [businessArea, setBusinessArea] = useState("")
  
  // Common Fields
  const [allocationDate, setAllocationDate] = useState(new Date().toISOString().split("T")[0])
  const [remarks, setRemarks] = useState("")
  const [status, setStatus] = useState<"Active" | "Returned" | "Pending">("Active")
  
  // Laptop Fields
  const [laptopFields, setLaptopFields] = useState<LaptopFields>({
    laptopSrNo: "",
    laptopOwnership: "Company",
    makeModel: "",
    configuration: "",
    charger: "Yes",
    bag: "No",
    headphoneSrNo: "",
    mouseSrNo: "",
    keyboardSrNo: "",
    dockStationSrNo: "",
    macConnectHardware: ""
  })
  
  // Mobile Fields
  const [mobileFields, setMobileFields] = useState<MobileFields>({
    mobileSrNo: "",
    imeiNo: "",
    makeModel: "",
    charger: "Yes",
    chargerSrNo: "",
    backCover: "No",
    simCard: "No",
    simNumber: ""
  })
  
  // Monitor Fields
  const [monitorFields, setMonitorFields] = useState<MonitorFields>({
    monitorSrNo: "",
    makeModel: "",
    powerCable: "Yes",
    hdmi: "Yes"
  })

  // Accessories
  const [accessories, setAccessories] = useState<AccessoryField[]>([
    { type: "", serialNumber: "" }
  ])
  
  // Accessories Fields
  const [accessoriesFields, setAccessoriesFields] = useState<AccessoryAllocationField[]>([])

  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mockEmployees, setMockEmployees] = useState<any[]>([])
  const [mockAssets, setMockAssets] = useState<any[]>([])

  // Filter assets by category
  const laptopAssets = mockAssets.filter(asset => asset.category === "Computers")
  const mobileAssets = mockAssets.filter(asset => asset.category === "Mobile")
  const monitorAssets = mockAssets.filter(asset => asset.category === "Monitor")
  const accessoryAssets = mockAssets.filter(asset => 
    ["Headphone", "Mouse", "Keyboard", "Dock-station", "Mac-Connector", "Charger", "Bag", "Cable", "Adapter", "Stand", "Case", "Screen Protector"].includes(asset.category)
  )

  useEffect(() => {
    // Load mock data
    const loadMockData = async () => {
      try {
        // Import mock data dynamically
        const { mockEmployees: employees, mockAssets: assets } = await import("@/lib/mock-data")
        setMockEmployees(employees)
        setMockAssets(assets)
      } catch (error) {
        console.error("Failed to load mock data:", error)
        setMockEmployees([])
        setMockAssets([])
      } finally {
        setIsLoading(false)
      }
    }
    
    loadMockData()
  }, [])

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
      return
    }
    
    // Initialize edit mode if params exist
    if (editId && editType && !isLoading) {
      setIsEditMode(true)
      setCategory(editType)
      // In a real app, fetch existing data here
      // For now, we'll simulate with mock data
      if (editType === "Laptop & Accessories") {
        setLaptopFields({
          laptopSrNo: "DLXPS13-001",
          laptopOwnership: "Company",
          makeModel: "Dell XPS 13",
          configuration: "i7, 16GB RAM, 512GB SSD",
          charger: "Yes",
          bag: "Yes",
          headphoneSrNo: "SNYHP-001",
          mouseSrNo: "LGTMS-001",
          keyboardSrNo: "LGTKB-001",
          dockStationSrNo: "DLDKS-001",
          macConnectHardware: "APLMC-001"
        })
        setEmpId("EMP001")
        setEmpName("John Doe")
        setBusinessArea("Engineering")
        setRemarks("Primary development machine")
        setStatus("Active")
      } else if (editType === "Accessories") {
        setAccessoriesFields([
          {
            id: "1",
            accessoryType: "Headphone",
            accessorySrNo: "SNYHP-001",
            makeModel: "Sony WH-1000XM5",
            condition: "New",
            quantity: "1"
          },
          {
            id: "2",
            accessoryType: "Mouse",
            accessorySrNo: "LGTMS-001",
            makeModel: "Logitech MX Master 3S",
            condition: "New",
            quantity: "1"
          }
        ])
        setEmpId("EMP001")
        setEmpName("John Doe")
        setBusinessArea("Engineering")
        setRemarks("Additional accessories for workstation")
        setStatus("Active")
      }
    } else {
      // Initialize with one accessory field for new allocation
      if (category === "Accessories" && accessoriesFields.length === 0) {
        addAccessory()
      }
    }
  }, [user, router, editId, editType, isLoading, category])

  if (!user || isLoading) return <LoadingSkeleton />

  const handleEmployeeSelect = (employeeId: string) => {
    setEmpId(employeeId)
    const employee = mockEmployees.find(e => e.employeeId === employeeId)
    if (employee) {
      setEmpName(employee.name)
    }
  }

  const handleAccessoryChange = (index: number, field: keyof AccessoryField, value: string) => {
    const updatedAccessories = [...accessories]
    updatedAccessories[index] = { ...updatedAccessories[index], [field]: value }
    
    // Auto-fill serial number for selected accessory type
    if (field === 'type' && value) {
      const accessoryAsset = accessoryAssets.find(a => a.category === value)
      if (accessoryAsset) {
        updatedAccessories[index].serialNumber = accessoryAsset.serialNumber
      }
    }
    
    setAccessories(updatedAccessories)
  }

  const handleLaptopFieldChange = (field: keyof LaptopFields, value: string) => {
    setLaptopFields(prev => ({ ...prev, [field]: value }))
    
    // Auto-fill make model when serial is selected
    if (field === "laptopSrNo") {
      const asset = laptopAssets.find(a => a.serialNumber === value)
      if (asset) {
        setLaptopFields(prev => ({
          ...prev,
          makeModel: `${asset.name} ${asset.model}`,
          configuration: asset.configuration
        }))
      }
    }
  }

  const handleMobileFieldChange = (field: keyof MobileFields, value: string) => {
    setMobileFields(prev => ({ ...prev, [field]: value }))
    
    // Auto-fill make model and IMEI when serial is selected
    if (field === "mobileSrNo") {
      const asset = mobileAssets.find(a => a.serialNumber === value)
      if (asset) {
        setMobileFields(prev => ({
          ...prev,
          makeModel: `${asset.name} ${asset.model}`,
          imeiNo: asset.serialNumber
        }))
      }
    }
  }

  const handleMonitorFieldChange = (field: keyof MonitorFields, value: string) => {
    setMonitorFields(prev => ({ ...prev, [field]: value }))
    
    // Auto-fill make model when serial is selected
    if (field === "monitorSrNo") {
      const asset = monitorAssets.find(a => a.serialNumber === value)
      if (asset) {
        setMonitorFields(prev => ({
          ...prev,
          makeModel: `${asset.name} ${asset.model}`
        }))
      }
    }
  }

  const handleAccessoryFieldChange = (index: number, field: keyof AccessoryAllocationField, value: string) => {
    const updatedAccessories = [...accessoriesFields]
    updatedAccessories[index] = { ...updatedAccessories[index], [field]: value }
    
    // Auto-fill make model when serial is selected
    if (field === 'accessorySrNo' && value) {
      const accessoryAsset = accessoryAssets.find(a => a.serialNumber === value)
      if (accessoryAsset) {
        updatedAccessories[index].makeModel = `${accessoryAsset.name} ${accessoryAsset.model}`
        updatedAccessories[index].accessoryType = accessoryAsset.category
      }
    } else if (field === 'accessoryType' && value && !updatedAccessories[index].accessorySrNo) {
      // Filter available assets by type
      const availableAssets = accessoryAssets.filter(a => a.category === value && a.status === "available")
      if (availableAssets.length > 0) {
        updatedAccessories[index].accessorySrNo = availableAssets[0].serialNumber
        updatedAccessories[index].makeModel = `${availableAssets[0].name} ${availableAssets[0].model}`
      }
    }
    
    setAccessoriesFields(updatedAccessories)
  }

  const addAccessory = () => {
    const newId = (accessoriesFields.length + 1).toString()
    setAccessoriesFields([
      ...accessoriesFields,
      {
        id: newId,
        accessoryType: "",
        accessorySrNo: "",
        makeModel: "",
        condition: "New",
        quantity: "1"
      }
    ])
  }

  const addLaptopAccessory = () => {
    setAccessories([...accessories, { type: "", serialNumber: "" }])
  }

  const removeAccessory = (index: number) => {
    if (accessoriesFields.length > 1) {
      const updatedAccessories = accessoriesFields.filter((_, i) => i !== index)
      setAccessoriesFields(updatedAccessories)
    }
  }

  const removeLaptopAccessory = (index: number) => {
    if (accessories.length > 1) {
      const updatedAccessories = accessories.filter((_, i) => i !== index)
      setAccessories(updatedAccessories)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const allocationData = {
      category,
      empId,
      empName,
      businessArea,
      allocationDate,
      remarks,
      status,
      ...(category === "Laptop & Accessories" && { laptopFields }),
      ...(category === "Mobile" && { mobileFields }),
      ...(category === "Monitor" && { monitorFields }),
      ...(category === "Accessories" && { accessories: accessoriesFields })
    }
    
    console.log("Allocation Data:", allocationData)
    
    if (isEditMode) {
      console.log("Updating allocation:", editId)
      // Update logic here
    } else {
      console.log("Creating new allocation")
      // Create logic here
    }
    
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      router.push('/admin/assets')
    }, 1500)
  }

  const resetForm = () => {
    setCategory("")
    setEmpId("")
    setEmpName("")
    setBusinessArea("")
    setAllocationDate(new Date().toISOString().split("T")[0])
    setRemarks("")
    setStatus("Active")
    setLaptopFields({
      laptopSrNo: "",
      laptopOwnership: "Company",
      makeModel: "",
      configuration: "",
      charger: "Yes",
      bag: "No",
      headphoneSrNo: "",
      mouseSrNo: "",
      keyboardSrNo: "",
      dockStationSrNo: "",
      macConnectHardware: ""
    })
    setMobileFields({
      mobileSrNo: "",
      imeiNo: "",
      makeModel: "",
      charger: "Yes",
      chargerSrNo: "",
      backCover: "No",
      simCard: "No",
      simNumber: ""
    })
    setMonitorFields({
      monitorSrNo: "",
      makeModel: "",
      powerCable: "Yes",
      hdmi: "Yes"
    })
    setAccessoriesFields([])
    setIsEditMode(false)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? "Edit Asset Allocation" : "Allocate New Asset"}
            </h1>
          </div>
          <button
            onClick={() => router.push('/admin/assets')}
            className="px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Back to Inventory
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 md:p-8">
          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">
                  {isEditMode ? "Allocation updated successfully!" : "Asset allocated successfully!"}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Employee Details */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-lg font-semibold text-gray-900">Employee Details</h2>
                <p className="text-sm text-gray-600 mt-1">Select employee and business area</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    EMP ID <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={empId}
                    onChange={(e) => handleEmployeeSelect(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    EMP Name
                  </label>
                  <input
                    type="text"
                    value={empName}
                    readOnly
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={businessArea}
                    onChange={(e) => setBusinessArea(e.target.value)}
                    placeholder="e.g., Engineering, Sales, Marketing"
                    required
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Asset Category */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-lg font-semibold text-gray-900">Asset Category</h2>
                <p className="text-sm text-gray-600 mt-1">Select the type of asset to allocate</p>
              </div>
              
              <div className="max-w-md">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  required
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="Laptop & Accessories">Laptop & Accessories</option>
                  <option value="Mobile">Mobile Devices</option>
                  <option value="Monitor">Monitors</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
            </div>

            {/* Laptop & Accessories Section */}
            {category === "Laptop & Accessories" && (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Laptop Details</h2>
                  <p className="text-sm text-gray-600 mt-1">Enter laptop specifications and accessories</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Laptop Serial No */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Laptop Sr. No. <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={laptopFields.laptopSrNo}
                      onChange={(e) => handleLaptopFieldChange("laptopSrNo", e.target.value)}
                      required
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Serial Number</option>
                      {laptopAssets.map((asset) => (
                        <option key={asset.id} value={asset.serialNumber}>
                          {asset.serialNumber} - {asset.name} {asset.model}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Laptop Ownership */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Laptop Ownership
                    </label>
                    <select
                      value={laptopFields.laptopOwnership}
                      onChange={(e) => handleLaptopFieldChange("laptopOwnership", e.target.value as OwnershipType)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Company">Company</option>
                      <option value="Employee">Employee</option>
                      <option value="Leased">Leased</option>
                    </select>
                  </div>

                  {/* Make Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Make Model
                    </label>
                    <input
                      type="text"
                      value={laptopFields.makeModel}
                      readOnly
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  {/* Configuration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Configuration
                    </label>
                    <input
                      type="text"
                      value={laptopFields.configuration}
                      readOnly
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  {/* Charger */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Charger
                    </label>
                    <select
                      value={laptopFields.charger}
                      onChange={(e) => handleLaptopFieldChange("charger", e.target.value as "Yes" | "No")}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* Bag */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bag
                    </label>
                    <select
                      value={laptopFields.bag}
                      onChange={(e) => handleLaptopFieldChange("bag", e.target.value as "Yes" | "No")}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                {/* Additional Accessories Section */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">Additional Accessories</h3>
                      <p className="text-sm text-gray-600 mt-1">Add extra accessories if needed</p>
                    </div>
                    <button
                      type="button"
                      onClick={addLaptopAccessory}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Accessory
                    </button>
                  </div>
                  
                  {accessories.map((accessory, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Asset Type</label>
                        <select
                          value={accessory.type}
                          onChange={(e) => handleAccessoryChange(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Type</option>
                          <option value="Headphone">Headphone</option>
                          <option value="Mouse">Mouse</option>
                          <option value="Keyboard">Keyboard</option>
                          <option value="Dock-station">Dock-station</option>
                          <option value="Mac-Connector">Mac-Connector</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                        <input
                          type="text"
                          value={accessory.serialNumber}
                          onChange={(e) => handleAccessoryChange(index, 'serialNumber', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        {accessories.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLaptopAccessory(index)}
                            className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Section */}
            {category === "Mobile" && (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Mobile Device Details</h2>
                  <p className="text-sm text-gray-600 mt-1">Enter mobile device specifications</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mobile Sr. No */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Sr. No. <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={mobileFields.mobileSrNo}
                      onChange={(e) => handleMobileFieldChange("mobileSrNo", e.target.value)}
                      required
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Serial Number</option>
                      {mobileAssets.map((asset) => (
                        <option key={asset.id} value={asset.serialNumber}>
                          {asset.serialNumber} - {asset.name} {asset.model}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* IMEI No */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IMEI No.
                    </label>
                    <input
                      type="text"
                      value={mobileFields.imeiNo}
                      onChange={(e) => handleMobileFieldChange("imeiNo", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Make Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Make Model
                    </label>
                    <input
                      type="text"
                      value={mobileFields.makeModel}
                      readOnly
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  {/* Charger */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Charger
                    </label>
                    <select
                      value={mobileFields.charger}
                      onChange={(e) => handleMobileFieldChange("charger", e.target.value as "Yes" | "No")}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* Charger Sr. No */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Charger Sr. No.
                    </label>
                    <input
                      type="text"
                      value={mobileFields.chargerSrNo}
                      onChange={(e) => handleMobileFieldChange("chargerSrNo", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Back Cover */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Back Cover
                    </label>
                    <select
                      value={mobileFields.backCover}
                      onChange={(e) => handleMobileFieldChange("backCover", e.target.value as "Yes" | "No")}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* SIM Card */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SIM Card
                    </label>
                    <select
                      value={mobileFields.simCard}
                      onChange={(e) => handleMobileFieldChange("simCard", e.target.value as "Yes" | "No")}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* SIM Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SIM Number
                    </label>
                    <input
                      type="text"
                      value={mobileFields.simNumber}
                      onChange={(e) => handleMobileFieldChange("simNumber", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Monitor Section */}
            {category === "Monitor" && (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Monitor Details</h2>
                  <p className="text-sm text-gray-600 mt-1">Enter monitor specifications</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Monitor Sr. No */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monitor Sr. No. <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={monitorFields.monitorSrNo}
                      onChange={(e) => handleMonitorFieldChange("monitorSrNo", e.target.value)}
                      required
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Serial Number</option>
                      {monitorAssets.map((asset) => (
                        <option key={asset.id} value={asset.serialNumber}>
                          {asset.serialNumber} - {asset.name} {asset.model}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Make Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Make Model
                    </label>
                    <input
                      type="text"
                      value={monitorFields.makeModel}
                      readOnly
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  {/* Power Cable */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Power Cable
                    </label>
                    <select
                      value={monitorFields.powerCable}
                      onChange={(e) => handleMonitorFieldChange("powerCable", e.target.value as "Yes" | "No")}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* HDMI */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HDMI
                    </label>
                    <select
                      value={monitorFields.hdmi}
                      onChange={(e) => handleMonitorFieldChange("hdmi", e.target.value as "Yes" | "No")}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Accessories Section */}
            {category === "Accessories" && (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Accessories</h2>
                      <p className="text-sm text-gray-600 mt-1">Add accessories for allocation</p>
                    </div>
                    <button
                      type="button"
                      onClick={addAccessory}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Accessory
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {accessoriesFields.map((accessory, index) => (
                    <div key={accessory.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium text-gray-900">Accessory #{index + 1}</h3>
                        {accessoriesFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAccessory(index)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Accessory Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Accessory Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={accessory.accessoryType}
                            onChange={(e) => handleAccessoryFieldChange(index, 'accessoryType', e.target.value)}
                            required
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Type</option>
                            <option value="Headphone">Headphone</option>
                            <option value="Mouse">Mouse</option>
                            <option value="Keyboard">Keyboard</option>
                            <option value="Dock-station">Dock Station</option>
                            <option value="Mac-Connector">Mac Connector</option>
                            <option value="Charger">Charger</option>
                            <option value="Bag">Bag</option>
                            <option value="Cable">Cable</option>
                            <option value="Adapter">Adapter</option>
                            <option value="Stand">Stand</option>
                            <option value="Case">Case</option>
                            <option value="Screen Protector">Screen Protector</option>
                          </select>
                        </div>
                        
                        {/* Accessory Serial Number */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Accessory Sr. No. <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={accessory.accessorySrNo}
                            onChange={(e) => handleAccessoryFieldChange(index, 'accessorySrNo', e.target.value)}
                            required
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Serial Number</option>
                            {accessoryAssets
                              .filter(asset => !accessory.accessoryType || asset.category === accessory.accessoryType)
                              .map((asset) => (
                                <option key={asset.id} value={asset.serialNumber}>
                                  {asset.serialNumber} - {asset.name} {asset.model}
                                </option>
                              ))}
                          </select>
                        </div>
                        
                        {/* Make Model */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Make Model
                          </label>
                          <input
                            type="text"
                            value={accessory.makeModel}
                            readOnly
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Allocation Details */}
            {category && (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Allocation Details</h2>
                  <p className="text-sm text-gray-600 mt-1">Set allocation date and status</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allocation Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={allocationDate}
                      onChange={(e) => setAllocationDate(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as "Active" | "Returned" | "Pending")}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remarks
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Add any additional notes or instructions..."
                      rows={3}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditMode ? "Update Allocation" : "Allocate Asset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded w-96 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        <div className="bg-white rounded-xl shadow border border-gray-200 p-8">
          <div className="space-y-8">
            {/* Employee Details Skeleton */}
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-32 animate-pulse"></div>
                    <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Asset Category Skeleton */}
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-10 bg-gray-100 rounded w-96 animate-pulse"></div>
            </div>
            
            {/* Form Actions Skeleton */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <div className="h-10 bg-gray-100 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-blue-200 rounded w-48 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

// Types (keep them outside the component)
type CategoryType = "" | "Laptop & Accessories" | "Mobile" | "Monitor" | "Accessories"
type AccessoryType = "" | "Headphone" | "Mouse" | "Keyboard" | "Dock-station" | "Mac-Connector" | "Charger" | "Bag" | "Cable" | "Adapter" | "Stand" | "Case" | "Screen Protector"
type OwnershipType = "Company" | "Employee" | "Leased"

type AccessoryAllocationField = {
  id: string
  accessoryType: AccessoryType
  accessorySrNo: string
  makeModel: string
  condition: "New" | "Like New" | "Good" | "Fair" | "Poor"
  quantity: string
}

type MobileFields = {
  mobileSrNo: string
  imeiNo: string
  makeModel: string
  charger: "Yes" | "No"
  chargerSrNo: string
  backCover: "Yes" | "No"
  simCard: "Yes" | "No"
  simNumber: string
}

type AccessoryField = {
  type: AccessoryType
  serialNumber: string
}

type MonitorFields = {
  monitorSrNo: string
  makeModel: string
  powerCable: "Yes" | "No"
  hdmi: "Yes" | "No"
}

type LaptopFields = {
  laptopSrNo: string
  laptopOwnership: OwnershipType
  makeModel: string
  configuration: string
  charger: "Yes" | "No"
  bag: "Yes" | "No"
  headphoneSrNo: string
  mouseSrNo: string
  keyboardSrNo: string
  dockStationSrNo: string
  macConnectHardware: string
}