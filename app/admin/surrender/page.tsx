"use client";

import { useAuth } from "@/lib/context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin-layout";
import { 
  mockLaptopAllocations, 
  mockMobileAllocations, 
  mockMonitorAllocations,
  mockAccessoriesAllocations,
  mockEmployees,
  mockAssets
} from "@/lib/mock-data";

export default function SurrenderPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [employeeAssets, setEmployeeAssets] = useState<any[]>([]);
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  // Prepare employee data from mock
  useEffect(() => {
    const prepareEmployees = () => {
      // Get all employees from mock data
      const employeesWithAssets = mockEmployees.map(emp => {
        return {
          id: emp.id,
          empId: emp.employeeId,
          empName: emp.name,
          designation: emp.designation,
          department: emp.department,
          email: emp.email,
          profileImage: emp.profileImage
        };
      });

      setAllEmployees(employeesWithAssets);
    };

    prepareEmployees();
  }, []);

  const handleEmployeeChange = (empId: string) => {
    setSelectedEmployee(empId);
    
    if (empId) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const assets = getAllAssetsForEmployee(empId);
        setEmployeeAssets(assets);
        setIsLoading(false);
      }, 300);
    } else {
      setEmployeeAssets([]);
    }
  };

  const getAllAssetsForEmployee = (empId: string) => {
    const allAssets: any[] = [];

    // 1. Get laptop allocations
    const laptopAssets = mockLaptopAllocations
      .filter(item => item.empId === empId && item.status === 'acknowledged')
      .map(item => ({
        id: item.id,
        type: 'Laptop',
        businessArea: item.businessArea,
        serialNumber: item.laptopSrNo,
        makeModel: item.makeModel,
        allocationDate: item.allocationDate,
        remarks: item.remarks || '',
        category: 'laptop'
      }));

    // 2. Get mobile allocations
    const mobileAssets = mockMobileAllocations
      .filter(item => item.empId === empId && item.status === 'acknowledged')
      .map(item => ({
        id: item.id,
        type: 'Mobile',
        businessArea: item.businessArea,
        serialNumber: item.mobileSrNo,
        makeModel: item.makeModel,
        allocationDate: item.allocationDate,
        remarks: item.remarks || '',
        category: 'mobile'
      }));

    // 3. Get monitor allocations
    const monitorAssets = mockMonitorAllocations
      .filter(item => item.empId === empId && item.status === 'acknowledged')
      .map(item => ({
        id: item.id,
        type: 'Monitor',
        businessArea: item.businessArea,
        serialNumber: item.monitorSrNo,
        makeModel: item.makeModel,
        allocationDate: item.allocationDate,
        remarks: item.remarks || '',
        category: 'monitor'
      }));

    // 4. Get accessories allocations
    const accessoryAssets = mockAccessoriesAllocations
      .filter(item => item.empId === empId && item.status === 'acknowledged')
      .flatMap(item => 
        item.accessories.map(acc => ({
          id: `${item.id}-${acc.id}`,
          type: acc.accessoryType,
          businessArea: item.businessArea,
          serialNumber: acc.accessorySrNo,
          makeModel: acc.makeModel,
          allocationDate: item.allocationDate,
          remarks: `${item.remarks || ''} - ${acc.condition}`,
          category: 'accessory'
        }))
      );

    // 5. Get assets from mockAssets that are allocated to this employee
    const allocatedAssets = mockAssets
      .filter(asset => asset.allocatedTo === empId && asset.status === 'allocated')
      .map(asset => ({
        id: asset.id,
        type: asset.category,
        businessArea: getBusinessAreaFromEmployee(empId),
        serialNumber: asset.serialNumber,
        makeModel: `${asset.name} ${asset.model}`,
        allocationDate: asset.allocationDate || '2024-01-01',
        remarks: asset.configuration,
        category: asset.category.toLowerCase()
      }));

    // Combine all assets
    allAssets.push(...laptopAssets, ...mobileAssets, ...monitorAssets, ...accessoryAssets, ...allocatedAssets);

    return allAssets;
  };

  const getBusinessAreaFromEmployee = (empId: string) => {
    const employee = mockEmployees.find(emp => emp.employeeId === empId);
    return employee?.department || 'Unknown';
  };

  const handleSurrender = (assetId: string) => {
    if (confirm("Are you sure you want to surrender this asset? This action cannot be undone.")) {
      // Remove the asset from the list
      setEmployeeAssets(prev => prev.filter(asset => asset.id !== assetId));
      
      // Show success message
      alert("Asset surrendered successfully!");
    }
  };

  const getAssetType = (type: string) => {
    // Convert to readable format
    const typeMap: {[key: string]: string} = {
      'laptop': '💻 Laptop',
      'mobile': '📱 Mobile',
      'monitor': '🖥️ Monitor',
      'Laptop': '💻 Laptop',
      'Mobile': '📱 Mobile',
      'Monitor': '🖥️ Monitor',
      'Headphone': '🎧 Headphone',
      'Mouse': '🖱️ Mouse',
      'Keyboard': '⌨️ Keyboard',
      'Dock-station': '⚡ Dock Station',
      'Mac-Connector': '🔌 Mac Connector',
      'Charger': '🔋 Charger',
      'Bag': '🎒 Bag',
      'Cable': '🔌 Cable',
      'Adapter': '🔌 Adapter',
      'Stand': '💻 Stand',
      'Case': '📱 Case',
      'Screen Protector': '📱 Screen Protector'
    };

    return typeMap[type] || type;
  };

  const getAssetColor = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('laptop')) return 'bg-blue-100 text-blue-800';
    if (cat.includes('mobile')) return 'bg-green-100 text-green-800';
    if (cat.includes('monitor')) return 'bg-purple-100 text-purple-800';
    if (cat.includes('accessory') || cat.includes('headphone') || cat.includes('mouse') || 
        cat.includes('keyboard') || cat.includes('dock') || cat.includes('charger') || 
        cat.includes('bag') || cat.includes('cable') || cat.includes('adapter') || 
        cat.includes('stand') || cat.includes('case') || cat.includes('protector')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  if (!user) return null;

  const selectedEmployeeData = allEmployees.find(emp => emp.empId === selectedEmployee);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Asset Surrender</h1>
          </div>
        </div>

        {/* Employee Selection Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Select Employee</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* EMP ID Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                EMP ID *
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Employee ID</option>
                {allEmployees.map(emp => (
                  <option key={emp.empId} value={emp.empId}>
                    {emp.empId} - {emp.empName}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Name (Auto-filled) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee Name
              </label>
              <input
                type="text"
                value={selectedEmployeeData?.empName || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                placeholder="Will auto-fill when EMP ID is selected"
              />
            </div>

            {/* Designation (Auto-filled) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation
              </label>
              <input
                type="text"
                value={selectedEmployeeData?.designation || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                placeholder="Will auto-fill when EMP ID is selected"
              />
            </div>
          </div>

          {/* Selected Employee Info */}
          {selectedEmployeeData && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{selectedEmployeeData.empName}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedEmployeeData.empId} • {selectedEmployeeData.department} • {selectedEmployeeData.designation}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Email: {selectedEmployeeData.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedEmployee("");
                    setEmployeeAssets([]);
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Assets Table */}
        {selectedEmployee && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Allocated Assets</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Assets currently allocated to {selectedEmployeeData?.empName}
                  </p>
                </div>
                {employeeAssets.length > 0 && (
                  <div className="text-sm font-medium text-gray-700">
                    {employeeAssets.length} asset{employeeAssets.length !== 1 ? 's' : ''} found
                  </div>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading assets...</p>
              </div>
            ) : employeeAssets.length === 0 ? (
              <div className="p-12 text-center">
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
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No assets found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedEmployeeData?.empName} doesn't have any allocated assets to surrender.
                </p>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Expected assets for this employee:</p>
                  <ul className="mt-1 space-y-1">
                    {selectedEmployeeData?.empId === "EMP001" && (
                      <>
                        <li>• Dell XPS 13 Laptop (DLXPS13-001)</li>
                        <li>• Dell 27" UltraSharp Monitor (DLMON-001)</li>
                        <li>• Sony Headphones (SNYHP-001)</li>
                        <li>• Logitech Mouse (LGTMS-001)</li>
                        <li>• Logitech Keyboard (LGTKB-001)</li>
                      </>
                    )}
                    {selectedEmployeeData?.empId === "EMP002" && (
                      <>
                        <li>• Apple MacBook Pro 14" Laptop (MBP14-001)</li>
                        <li>• iPhone 14 Pro Mobile (IPH14-001)</li>
                        <li>• LG 34" UltraWide Monitor (LGMON-001)</li>
                        <li>• Dell Dock Station (DLDKS-001)</li>
                        <li>• Apple USB-C to HDMI Connector (APLMC-001)</li>
                        <li>• 65W Type-C Charger (CHG-LPT001)</li>
                      </>
                    )}
                    {selectedEmployeeData?.empId === "EMP003" && (
                      <>
                        <li>• Lenovo ThinkPad X1 Carbon Laptop (LNTKP-001) - Returned</li>
                        <li>• Samsung 32" Odyssey Monitor (SGMON-001) - Returned</li>
                      </>
                    )}
                    {selectedEmployeeData?.empId === "EMP004" && (
                      <>
                        <li>• Samsung Galaxy S23 Ultra Mobile (SGS23-001)</li>
                        <li>• Professional Backpack Bag (BAG-LPT001)</li>
                        <li>• Protective Phone Case (CAS-PHN001)</li>
                        <li>• Tempered Glass Screen Protector (PRO-SCR001)</li>
                      </>
                    )}
                    {selectedEmployeeData?.empId === "EMP005" && (
                      <>
                        <li>• Google Pixel 7 Pro Mobile (GPXL7-001) - Pending</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asset Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business Area
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Serial Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Make & Model
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Allocation Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employeeAssets.map((asset) => (
                      <tr
                        key={asset.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAssetColor(asset.type)}`}>
                            {getAssetType(asset.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {asset.businessArea}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {asset.serialNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {asset.makeModel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {asset.allocationDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleSurrender(asset.id)}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors font-medium"
                          >
                            Surrender
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Table Footer */}
            {employeeAssets.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">
                    {employeeAssets.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {employeeAssets.length}
                  </span>{" "}
                  assets
                </div>
                <div className="text-sm text-gray-600">
                  Click "Surrender" to return an asset from the employee
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold text-blue-900">How to Surrender Assets</h3>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li>1. Select an employee from the EMP ID dropdown</li>
                <li>2. View all allocated assets in the table below (laptops, mobiles, monitors, accessories)</li>
                <li>3. Click the "Surrender" button next to any asset to remove it from the employee</li>
                <li>4. The surrendered asset will be immediately removed from the employee's allocation list</li>
                <li className="mt-2 font-medium">Note: Only assets with "acknowledged" status are shown</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}