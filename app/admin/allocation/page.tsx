"use client"

import type React from "react"

import { useAuth } from "@/lib/context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { mockEmployees, mockAssets } from "@/lib/mock-data"

type CategoryType = "" | "Laptop & Accessories" | "Mobile" | "Monitor"

type AccessoryType = "" | "Headphone" | "Mouse" | "Keyboard" | "Dock-station" | "Mac-Connector"

type AccessoryField = {
  type: AccessoryType
  serialNumber: string
}

type MobileFields = {
  mobileSerial: string
  imei: string
  makeModel: string
  hasCharger: "yes" | "no"
  chargerSerial: string
  hasBackCover: "yes" | "no"
  hasSimCard: "yes" | "no"
  simNumber: string
  penalties: string
}

type MonitorFields = {
  monitorSerial: string
  makeModel: string
  hasPowerCable: "yes" | "no"
  hasHdmi: "yes" | "no"
}

export default function AllocationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [category, setCategory] = useState<CategoryType>("")
  const [accessories, setAccessories] = useState<AccessoryField[]>([{ type: "", serialNumber: "" }])
  const [mobileFields, setMobileFields] = useState<MobileFields>({
    mobileSerial: "",
    imei: "",
    makeModel: "",
    hasCharger: "no",
    chargerSerial: "",
    hasBackCover: "no",
    hasSimCard: "no",
    simNumber: "",
    penalties: ""
  })
  const [monitorFields, setMonitorFields] = useState<MonitorFields>({
    monitorSerial: "",
    makeModel: "",
    hasPowerCable: "no",
    hasHdmi: "no"
  })
  const [formData, setFormData] = useState({
    empId: "",
    empName: "",
    businessArea: "",
    category: "" as CategoryType,
    laptopSerial: "",
    laptopOwnership: "",
    laptopMakeModel: "",
    laptopConfiguration: "",
    hasCharger: "no",
    hasBag: "no",
    allocationDate: new Date().toISOString().split("T")[0],
    remarks: "",
  })
  const [submitted, setSubmitted] = useState(false)

  // Filter assets by category
  const laptopAssets = mockAssets.filter(asset => asset.category === "Computers")
  const mobileAssets = mockAssets.filter(asset => asset.category === "Mobile")
  const monitorAssets = mockAssets.filter(asset => asset.category === "Monitor")
  const accessoryAssets = mockAssets.filter(asset => ["Headphone", "Mouse", "Keyboard", "Dock-station", "Mac-Connector"].includes(asset.category))

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-fill employee name when EMP ID is selected
    if (name === "empId") {
      const employee = mockEmployees.find((e) => e.employeeId === value)
      if (employee) {
        setFormData((prev) => ({
          ...prev,
          empName: employee.name,
          // Don't auto-fill business area - user will type it
        }))
      }
    }

    // Auto-fill laptop details when serial number is selected
    if (name === "laptopSerial") {
      const asset = laptopAssets.find((a) => a.serialNumber === value)
      if (asset) {
        setFormData((prev) => ({
          ...prev,
          laptopMakeModel: `${asset.name} ${asset.model}`,
          laptopConfiguration: asset.configuration,
          laptopOwnership: asset.allocationType || "", // Auto-fill ownership from allocation type
        }))
      }
    }

    // Handle category change
    if (name === "category") {
      setCategory(value as CategoryType)
      setFormData((prev) => ({ ...prev, category: value as CategoryType }))
      
      // Reset accessory fields
      setAccessories([{ type: "", serialNumber: "" }])
    }
  }

  const handleMobileFieldChange = (field: keyof MobileFields, value: string) => {
    const updatedFields = { ...mobileFields, [field]: value }
    
    // Auto-fill mobile details when serial number is selected
    if (field === "mobileSerial") {
      const mobileAsset = mobileAssets.find((a) => a.serialNumber === value)
      if (mobileAsset) {
        updatedFields.makeModel = `${mobileAsset.name} ${mobileAsset.model}`
        updatedFields.imei = mobileAsset.serialNumber // Using serial as IMEI for mock
      }
    }
    
    setMobileFields(updatedFields)
  }

  const handleMonitorFieldChange = (field: keyof MonitorFields, value: string) => {
    const updatedFields = { ...monitorFields, [field]: value }
    
    // Auto-fill monitor details when serial number is selected
    if (field === "monitorSerial") {
      const monitorAsset = monitorAssets.find((a) => a.serialNumber === value)
      if (monitorAsset) {
        updatedFields.makeModel = `${monitorAsset.name} ${monitorAsset.model}`
      }
    }
    
    setMonitorFields(updatedFields)
  }

  const handleAccessoryChange = (index: number, field: keyof AccessoryField, value: string) => {
    const updatedAccessories = [...accessories]
    updatedAccessories[index][field] = value as any
    
    // Auto-fill serial number for Headphone and Mouse
    if (field === 'type' && (value === 'Headphone' || value === 'Mouse')) {
      const accessoryAsset = accessoryAssets.find((a) => a.category === value)
      if (accessoryAsset) {
        updatedAccessories[index].serialNumber = accessoryAsset.serialNumber
      }
    }
    
    setAccessories(updatedAccessories)
  }

  const addAccessory = () => {
    setAccessories([...accessories, { type: "", serialNumber: "" }])
  }

  const removeAccessory = (index: number) => {
    if (accessories.length > 1) {
      const updatedAccessories = accessories.filter((_, i) => i !== index)
      setAccessories(updatedAccessories)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prepare data based on category
    const allocationData = {
      ...formData,
      category,
      accessories: category === "Laptop & Accessories" ? accessories : [],
      mobileFields: category === "Mobile" ? mobileFields : undefined,
      monitorFields: category === "Monitor" ? monitorFields : undefined
    }
    
    console.log("Allocation Data:", allocationData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const resetForm = () => {
    setFormData({
      empId: "",
      empName: "",
      businessArea: "",
      category: "",
      laptopSerial: "",
      laptopOwnership: "",
      laptopMakeModel: "",
      laptopConfiguration: "",
      hasCharger: "no",
      hasBag: "no",
      allocationDate: new Date().toISOString().split("T")[0],
      remarks: "",
    })
    setCategory("")
    setAccessories([{ type: "", serialNumber: "" }])
    setMobileFields({
      mobileSerial: "",
      imei: "",
      makeModel: "",
      hasCharger: "no",
      chargerSerial: "",
      hasBackCover: "no",
      hasSimCard: "no",
      simNumber: "",
      penalties: ""
    })
    setMonitorFields({
      monitorSerial: "",
      makeModel: "",
      hasPowerCable: "no",
      hasHdmi: "no"
    })
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
        <div className="bg-card rounded-lg shadow border border-border p-6 md:p-8 max-w-7xl mx-auto">
          {submitted && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-md">
              Asset allocated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee Section */}
            <div className="space-y-4 pb-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Employee Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">EMP ID *</label>
                  <select
                    name="empId"
                    value={formData.empId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  <label className="block text-sm font-medium text-foreground mb-1">EMP Name</label>
                  <input
                    type="text"
                    value={formData.empName}
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-secondary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Business Area *</label>
                  <input
                    type="text"
                    name="businessArea"
                    value={formData.businessArea}
                    onChange={handleInputChange}
                    placeholder="Type business area"
                    required
                    className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-4 pb-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Category</h2>
              <div className="w-full md:w-1/2">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Category</option>
                  <option value="Laptop & Accessories">Laptop & Accessories</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Monitor">Monitor</option>
                </select>
              </div>
            </div>

            {/* Laptop & Accessories Section */}
            {category === "Laptop & Accessories" && (
              <>
                <div className="space-y-4 pb-6 border-b border-border">
                  <h2 className="text-lg font-semibold text-foreground">Laptop Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Laptop Sr. No. *</label>
                      <select
                        name="laptopSerial"
                        value={formData.laptopSerial}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select Serial Number</option>
                        {laptopAssets.map((asset) => (
                          <option key={asset.id} value={asset.serialNumber}>
                            {asset.serialNumber} - {asset.name} {asset.model}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Laptop Ownership</label>
                      <input
                        type="text"
                        name="laptopOwnership"
                        value={formData.laptopOwnership}
                        readOnly
                        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-secondary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Make Model</label>
                      <input
                        type="text"
                        value={formData.laptopMakeModel}
                        readOnly
                        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-secondary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Configuration</label>
                      <input
                        type="text"
                        value={formData.laptopConfiguration}
                        readOnly
                        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-secondary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Charger</label>
                      <select
                        name="hasCharger"
                        value={formData.hasCharger}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Bag</label>
                      <select
                        name="hasBag"
                        value={formData.hasBag}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Accessories Section */}
                <div className="space-y-4 pb-6 border-b border-border">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-foreground">Accessories</h2>
                    <button
                      type="button"
                      onClick={addAccessory}
                      className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all"
                    >
                      + Add Accessory
                    </button>
                  </div>
                  
                  {accessories.map((accessory, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-secondary/20 rounded-md">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Asset Type</label>
                        <select
                          value={accessory.type}
                          onChange={(e) => handleAccessoryChange(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select Type</option>
                          <option value="Headphone">Headphone</option>
                          <option value="Mouse">Mouse</option>
                          <option value="Keyboard">Keyboard</option>
                          <option value="Dock-station">Dock-station</option>
                          <option value="Mac-Connector">Mac-Connector</option>
                        </select>
                      </div>
                      
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-foreground mb-1">Serial Number</label>
                          <input
                            type="text"
                            value={accessory.serialNumber}
                            onChange={(e) => handleAccessoryChange(index, 'serialNumber', e.target.value)}
                            readOnly={accessory.type === "Headphone" || accessory.type === "Mouse"}
                            className={`w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${(accessory.type === "Headphone" || accessory.type === "Mouse") ? "bg-secondary" : ""}`}
                          />
                        </div>
                        
                        {accessories.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAccessory(index)}
                            className="px-2.5 py-2 text-sm bg-red-500 text-white rounded-md hover:opacity-90 transition-all"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Mobile Section */}
            {category === "Mobile" && (
              <div className="space-y-4 pb-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Mobile Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Mobile Sr. No.</label>
                    <select
                      value={mobileFields.mobileSerial}
                      onChange={(e) => handleMobileFieldChange('mobileSerial', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Serial Number</option>
                      {mobileAssets.map((asset) => (
                        <option key={asset.id} value={asset.serialNumber}>
                          {asset.serialNumber} - {asset.name} {asset.model}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Make model</label>
                    <input
                      type="text"
                      value={mobileFields.makeModel}
                      readOnly
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">IMEI No.</label>
                    <input
                      type="text"
                      value={mobileFields.imei}
                      readOnly
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Charger</label>
                    <select
                      value={mobileFields.hasCharger}
                      onChange={(e) => handleMobileFieldChange('hasCharger', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Charger Sr. No.</label>
                    <input
                      type="text"
                      value={mobileFields.chargerSerial}
                      onChange={(e) => handleMobileFieldChange('chargerSerial', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Back Cover</label>
                    <select
                      value={mobileFields.hasBackCover}
                      onChange={(e) => handleMobileFieldChange('hasBackCover', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">SIM Card</label>
                    <select
                      value={mobileFields.hasSimCard}
                      onChange={(e) => handleMobileFieldChange('hasSimCard', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">SIM Card Number</label>
                    <input
                      type="text"
                      value={mobileFields.simNumber}
                      onChange={(e) => handleMobileFieldChange('simNumber', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Monitor Section */}
            {category === "Monitor" && (
              <div className="space-y-4 pb-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Monitor Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Monitor Sr. No.</label>
                    <select
                      value={monitorFields.monitorSerial}
                      onChange={(e) => handleMonitorFieldChange('monitorSerial', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Serial Number</option>
                      {monitorAssets.map((asset) => (
                        <option key={asset.id} value={asset.serialNumber}>
                          {asset.serialNumber} - {asset.name} {asset.model}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Make model</label>
                    <input
                      type="text"
                      value={monitorFields.makeModel}
                      readOnly
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Power Cable</label>
                    <select
                      value={monitorFields.hasPowerCable}
                      onChange={(e) => handleMonitorFieldChange('hasPowerCable', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">HDMI</label>
                    <select
                      value={monitorFields.hasHdmi}
                      onChange={(e) => handleMonitorFieldChange('hasHdmi', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Allocation Section */}
            <div className="space-y-4 pb-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Allocation Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Allocation Date *</label>
                  <input
                    type="date"
                    name="allocationDate"
                    value={formData.allocationDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-foreground mb-1">Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    placeholder="Add any additional notes..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 text-sm border border-border rounded-md text-foreground hover:bg-secondary transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all font-medium"
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