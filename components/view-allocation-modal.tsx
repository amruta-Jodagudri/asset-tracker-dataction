"use client"

import { X } from "lucide-react"
import type { LaptopAllocation, MobileAllocation, MonitorAllocation } from "@/lib/mock-data"

type AssetType = "laptop" | "mobile" | "monitor"

interface ViewAllocationModalProps {
  isOpen: boolean
  onClose: () => void
  type: AssetType
  data: LaptopAllocation | MobileAllocation | MonitorAllocation | null
}

export default function ViewAllocationModal({ isOpen, onClose, type, data }: ViewAllocationModalProps) {
  if (!isOpen || !data) return null

  const renderLaptopDetails = (data: LaptopAllocation) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Employee Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">EMP ID</span>
                <span className="text-sm font-medium">{data.empId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Name</span>
                <span className="text-sm font-medium">{data.empName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Business Area</span>
                <span className="text-sm font-medium">{data.businessArea}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Laptop Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Serial Number</span>
                <span className="text-sm font-medium">{data.laptopSrNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Make & Model</span>
                <span className="text-sm font-medium">{data.makeModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ownership</span>
                <span className="text-sm font-medium capitalize">{data.laptopOwnership}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Configuration</span>
                <span className="text-sm font-medium">{data.configuration}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Accessories</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Charger</span>
                <span className={`text-sm font-medium ${data.charger === 'yes' ? 'text-green-600' : 'text-red-600'}`}>
                  {data.charger === 'yes' ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bag</span>
                <span className={`text-sm font-medium ${data.bag === 'yes' ? 'text-green-600' : 'text-red-600'}`}>
                  {data.bag === 'yes' ? 'Yes' : 'No'}
                </span>
              </div>
              {data.headphoneSrNo && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Headphone Sr. No.</span>
                  <span className="text-sm font-medium">{data.headphoneSrNo}</span>
                </div>
              )}
              {data.mouseSrNo && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mouse Sr. No.</span>
                  <span className="text-sm font-medium">{data.mouseSrNo}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Allocation Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Allocation Date</span>
                <span className="text-sm font-medium">{data.allocationDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  data.status === "active"
                    ? "bg-green-100 text-green-700"
                    : data.status === "returned"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {data.remarks && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Remarks</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{data.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderMobileDetails = (data: MobileAllocation) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Employee Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">EMP ID</span>
                <span className="text-sm font-medium">{data.empId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Name</span>
                <span className="text-sm font-medium">{data.empName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Business Area</span>
                <span className="text-sm font-medium">{data.businessArea}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Device Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Serial Number</span>
                <span className="text-sm font-medium">{data.mobileSrNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">IMEI Number</span>
                <span className="text-sm font-medium">{data.imeiNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Make & Model</span>
                <span className="text-sm font-medium">{data.makeModel}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Accessories</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Charger</span>
                <span className={`text-sm font-medium ${data.charger === 'yes' ? 'text-green-600' : 'text-red-600'}`}>
                  {data.charger === 'yes' ? 'Yes' : 'No'}
                </span>
              </div>
              {data.chargerSrNo && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Charger Sr. No.</span>
                  <span className="text-sm font-medium">{data.chargerSrNo}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Back Cover</span>
                <span className={`text-sm font-medium ${data.backCover === 'yes' ? 'text-green-600' : 'text-red-600'}`}>
                  {data.backCover === 'yes' ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">SIM Card</span>
                <span className={`text-sm font-medium ${data.simCard === 'yes' ? 'text-green-600' : 'text-red-600'}`}>
                  {data.simCard === 'yes' ? 'Yes' : 'No'}
                </span>
              </div>
              {data.simNumber && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">SIM Number</span>
                  <span className="text-sm font-medium">{data.simNumber}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Allocation Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Allocation Date</span>
                <span className="text-sm font-medium">{data.allocationDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  data.status === "active"
                    ? "bg-green-100 text-green-700"
                    : data.status === "returned"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {data.remarks && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Remarks</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{data.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderMonitorDetails = (data: MonitorAllocation) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Employee Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">EMP ID</span>
                <span className="text-sm font-medium">{data.empId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Name</span>
                <span className="text-sm font-medium">{data.empName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Business Area</span>
                <span className="text-sm font-medium">{data.businessArea}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Monitor Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Serial Number</span>
                <span className="text-sm font-medium">{data.monitorSrNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Make & Model</span>
                <span className="text-sm font-medium">{data.makeModel}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Accessories</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Power Cable</span>
                <span className={`text-sm font-medium ${data.powerCable === 'yes' ? 'text-green-600' : 'text-red-600'}`}>
                  {data.powerCable === 'yes' ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">HDMI Cable</span>
                <span className={`text-sm font-medium ${data.hdmi === 'yes' ? 'text-green-600' : 'text-red-600'}`}>
                  {data.hdmi === 'yes' ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Allocation Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Allocation Date</span>
                <span className="text-sm font-medium">{data.allocationDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  data.status === "active"
                    ? "bg-green-100 text-green-700"
                    : data.status === "returned"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {data.remarks && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Remarks</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{data.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                View Allocation Details
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {type === 'laptop' ? 'Laptop & Accessories' : 
                 type === 'mobile' ? 'Mobile Device' : 'Monitor'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
            {type === 'laptop' && renderLaptopDetails(data as LaptopAllocation)}
            {type === 'mobile' && renderMobileDetails(data as MobileAllocation)}
            {type === 'monitor' && renderMonitorDetails(data as MonitorAllocation)}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}