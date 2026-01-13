// Simple CSV export utility for Excel compatibility
export function generateCSV(headers: string[], rows: (string | number)[][]): string {
  const csvContent = [
    headers.map((h) => `"${h}"`).join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n")

  return csvContent
}

export function downloadCSV(filename: string, csvContent: string) {
  const element = document.createElement("a")
  element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent))
  element.setAttribute("download", filename)
  element.style.display = "none"
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export function exportTotalAssetReport(assets: any[]) {
  const headers = [
    "Asset ID",
    "Name",
    "Category",
    "Model",
    "Serial Number",
    "Status",
    "Purchase Date",
    "Warranty Expiry",
  ]
  const rows = assets.map((asset) => [
    asset.assetId,
    asset.name,
    asset.category,
    asset.model,
    asset.serialNumber,
    asset.status.replace("_", " "),
    asset.purchaseDate,
    asset.warrantyExpiry,
  ])

  const csv = generateCSV(headers, rows)
  downloadCSV("total-asset-report.csv", csv)
}

export function exportAllocatedVsAvailable(assets: any[]) {
  const allocated = assets.filter((a) => a.status === "allocated").length
  const available = assets.filter((a) => a.status === "available").length
  const underRepair = assets.filter((a) => a.status === "under_repair").length

  const headers = ["Status", "Count", "Percentage"]
  const total = assets.length
  const rows = [
    ["Allocated", allocated, ((allocated / total) * 100).toFixed(2)],
    ["Available", available, ((available / total) * 100).toFixed(2)],
    ["Under Repair", underRepair, ((underRepair / total) * 100).toFixed(2)],
  ]

  const csv = generateCSV(headers, rows)
  downloadCSV("allocated-vs-available.csv", csv)
}

export function exportEmployeeWiseAssets(assets: any[], allocations: any[], employees: any[]) {
  const headers = ["Employee ID", "Employee Name", "Total Assets", "Allocated", "Available"]

  const rows = employees.map((emp) => {
    const empAllocations = allocations.filter((a) => a.employeeId === emp.employeeId)
    const empAssets = empAllocations.length
    const allocated = empAllocations.filter((a) => a.status === "approved").length
    const available = empAssets - allocated

    return [emp.employeeId, emp.name, empAssets, allocated, available]
  })

  const csv = generateCSV(headers, rows)
  downloadCSV("employee-wise-assets.csv", csv)
}

export function exportWarrantyExpiry(assets: any[]) {
  const headers = ["Asset ID", "Name", "Category", "Model", "Warranty Expiry", "Days Until Expiry"]
  const today = new Date()

  const rows = assets.map((asset) => {
    const expiryDate = new Date(asset.warrantyExpiry)
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return [asset.assetId, asset.name, asset.category, asset.model, asset.warrantyExpiry, daysUntilExpiry]
  })

  const csv = generateCSV(headers, rows)
  downloadCSV("warranty-expiry-report.csv", csv)
}

export function exportAssetRental(assets: any[]) {
  const rentalAssets = assets.filter((a) => a.allocationType === "Loan" || a.allocationType === "Temporary")

  const headers = ["Asset ID", "Name", "Category", "Model", "Allocation Type", "Status"]
  const rows = rentalAssets.map((asset) => [
    asset.assetId,
    asset.name,
    asset.category,
    asset.model,
    asset.allocationType || "N/A",
    asset.status,
  ])

  const csv = generateCSV(headers, rows)
  downloadCSV("asset-rental-report.csv", csv)
}
