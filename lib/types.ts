export type UserRole = "admin" | "employee"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  designation: string
  department: string
  profileImage: string
  employeeId: string
}

export interface Asset {
  id: string
  assetId: string
  name: string
  category: string
  model: string
  configuration: string
  serialNumber: string
  purchaseDate: string
  warrantyExpiry: string
  status: "available" | "allocated" | "under_repair" | "returned"
  allocatedTo?: string
  allocationDate?: string
  allocationType?: string
}

export interface Allocation {
  id: string
  assetId: string
  employeeId: string
  allocationDate: string
  allocationType: string
  remarks: string
  status: "pending" | "approved"
  acknowledgmentDate?: string
  selfieUrl?: string
  idProofUrl?: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}
