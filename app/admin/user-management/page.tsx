"use client"

import { useAuth } from "@/lib/context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { mockAssets, mockEmployees } from "@/lib/mock-data"
import { Eye, Edit, Trash2, PlusCircle, X, EyeOff, Eye as EyeIcon, User, Mail, Briefcase, Building, Hash, Calendar, Phone, Shield, CheckCircle, XCircle } from "lucide-react"

interface Employee {
  id: string
  employeeId: string
  name: string
  email: string
  designation: string
  department: string
  username: string
  password: string
  phone?: string
  joinDate?: string
  status?: "active" | "inactive"
}

interface EmployeeFormData {
  name: string
  email: string
  designation: string
  department: string
  employeeId: string
  username: string
  password: string
  phone?: string
  joinDate?: string
}

export default function UserManagement() {
  const { user } = useAuth()
  const router = useRouter()
  const [assets] = useState(mockAssets)
  const [employees, setEmployees] = useState<Employee[]>(() => 
    mockEmployees.map(emp => ({
      ...emp,
      username: emp.email.split('@')[0],
      password: `${emp.employeeId.toLowerCase()}123`,
      phone: emp.phone || "+1 (555) 123-4567",
      joinDate: emp.joinDate || "2024-01-15",
      status: "active" as const
    }))
  )
  const [showPassword, setShowPassword] = useState<{[key: string]: boolean}>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showFormPassword, setShowFormPassword] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    email: "",
    designation: "",
    department: "",
    employeeId: "",
    username: "",
    password: "",
    phone: "",
    joinDate: new Date().toISOString().split('T')[0]
  })
  const [formErrors, setFormErrors] = useState<Partial<EmployeeFormData>>({})
  const [autoGenerateCredentials, setAutoGenerateCredentials] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  // Handle password visibility toggle for table
  const togglePasswordVisibility = (empId: string) => {
    setShowPassword(prev => ({
      ...prev,
      [empId]: !prev[empId]
    }))
  }

  // Handle view employee
  const handleViewEmployee = (empId: string) => {
    const employee = employees.find(emp => emp.id === empId)
    if (employee) {
      setSelectedEmployee(employee)
      setShowViewModal(true)
    }
  }

  // Handle edit employee
  const handleEditEmployee = (empId: string) => {
    const employee = employees.find(emp => emp.id === empId)
    if (!employee) return

    // Pre-fill form with employee data for editing
    setFormData({
      name: employee.name,
      email: employee.email,
      designation: employee.designation,
      department: employee.department,
      employeeId: employee.employeeId,
      username: employee.username,
      password: employee.password,
      phone: employee.phone || "",
      joinDate: employee.joinDate || new Date().toISOString().split('T')[0]
    })
    setAutoGenerateCredentials(false)
    setShowAddForm(true)
  }

  const handleDeleteEmployee = (empId: string) => {
    const employee = employees.find(emp => emp.id === empId)
    if (employee && window.confirm(`Are you sure you want to delete employee ${employee.name} (${employee.employeeId})?`)) {
      setEmployees(prev => prev.filter(emp => emp.id !== empId))
      alert(`Employee ${employee.name} has been deleted successfully.`)
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Auto-generate username when email changes
    if (name === "email" && autoGenerateCredentials) {
      const username = value.split('@')[0]
      setFormData(prev => ({
        ...prev,
        username: username,
        password: prev.employeeId ? `${prev.employeeId.toLowerCase()}123` : ""
      }))
    }
    
    // Auto-generate password when employee ID changes
    if (name === "employeeId" && autoGenerateCredentials) {
      setFormData(prev => ({
        ...prev,
        password: value ? `${value.toLowerCase()}123` : ""
      }))
    }
    
    // Clear error for this field
    if (formErrors[name as keyof EmployeeFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  // Handle manual username/password changes
  const handleUsernameChange = (username: string) => {
    setFormData(prev => ({ ...prev, username }))
    setAutoGenerateCredentials(false)
  }

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }))
    setAutoGenerateCredentials(false)
  }

  // Toggle auto-generate credentials
  const toggleAutoGenerateCredentials = () => {
    setAutoGenerateCredentials(!autoGenerateCredentials)
    if (!autoGenerateCredentials) {
      // Re-generate credentials
      const username = formData.email.split('@')[0]
      const password = formData.employeeId ? `${formData.employeeId.toLowerCase()}123` : ""
      setFormData(prev => ({
        ...prev,
        username,
        password
      }))
    }
  }

  // Generate default username from email
  const generateUsername = (email: string) => {
    return email.split('@')[0]
  }

  // Generate default password
  const generatePassword = (empId: string) => {
    return `${empId.toLowerCase()}123`
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      designation: "",
      department: "",
      employeeId: "",
      username: "",
      password: "",
      phone: "",
      joinDate: new Date().toISOString().split('T')[0]
    })
    setFormErrors({})
    setAutoGenerateCredentials(true)
    setShowFormPassword(false)
  }

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<EmployeeFormData> = {}
    
    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format"
    } else if (employees.some(emp => emp.email === formData.email && emp.employeeId !== formData.employeeId)) {
      errors.email = "Email already exists"
    }
    if (!formData.designation.trim()) errors.designation = "Designation is required"
    if (!formData.department.trim()) errors.department = "Department is required"
    if (!formData.employeeId.trim()) {
      errors.employeeId = "Employee ID is required"
    } else if (employees.some(emp => emp.employeeId === formData.employeeId && emp.id !== formData.employeeId)) {
      errors.employeeId = "Employee ID already exists"
    }
    if (!formData.username.trim()) errors.username = "Username is required"
    if (!formData.password.trim()) errors.password = "Password is required"
    if (formData.password.length < 6) errors.password = "Password must be at least 6 characters"
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    // Check if we're editing an existing employee
    const existingEmployee = employees.find(emp => emp.employeeId === formData.employeeId)
    
    if (existingEmployee) {
      // Update existing employee
      setEmployees(prev => prev.map(emp => 
        emp.id === existingEmployee.id ? {
          ...emp,
          name: formData.name,
          email: formData.email,
          designation: formData.designation,
          department: formData.department,
          employeeId: formData.employeeId,
          username: formData.username,
          password: formData.password,
          phone: formData.phone || emp.phone,
          joinDate: formData.joinDate || emp.joinDate
        } : emp
      ))
      
      alert(`Employee ${formData.name} (${formData.employeeId}) has been updated successfully!`)
    } else {
      // Create new employee
      const newEmployee: Employee = {
        id: `emp-${Date.now()}`,
        employeeId: formData.employeeId,
        name: formData.name,
        email: formData.email,
        designation: formData.designation,
        department: formData.department,
        username: formData.username,
        password: formData.password,
        phone: formData.phone,
        joinDate: formData.joinDate,
        status: "active"
      }
      
      // Add to employees list
      setEmployees(prev => [...prev, newEmployee])
      
      alert(`Employee ${newEmployee.name} (${newEmployee.employeeId}) has been onboarded successfully!`)
    }
    
    // Reset form and close modal
    resetForm()
    setShowAddForm(false)
  }

  // Export employee list
  const exportEmployeeList = () => {
    const headers = ["EMP ID", "Employee Name", "Designation", "Department", "Email", "Username", "Status"]
    const csvContent = [
      headers.join(","),
      ...employees.map(emp => [
        emp.employeeId,
        `"${emp.name}"`,
        `"${emp.designation}"`,
        `"${emp.department}"`,
        emp.email,
        emp.username,
        "Active"
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `Employee_List_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Format password display
  const getPasswordDisplay = (empId: string, password: string) => {
    return showPassword[empId] ? password : "••••••••"
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Sample departments and designations for dropdown
  const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "IT", "Customer Support"]
  const designations = ["Software Engineer", "Senior Software Engineer", "Manager", "Director", "Analyst", "Specialist", "Lead", "Executive"]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Active Users List Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Active Users</h2>
            <p className="text-sm text-muted-foreground mt-1">
              List of onboarded employees with system access
            </p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowAddForm(true)
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all font-medium flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Add Employee
          </button>
        </div>

        {employees.length === 0 ? (
          <div className="text-center py-8 border border-gray-200 rounded-lg">
            <p className="text-gray-500">No employees found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EMP ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Designation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Password
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {employee.employeeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-xs text-gray-500">{employee.department}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.designation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {employee.username}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            {getPasswordDisplay(employee.id, employee.password)}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(employee.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {showPassword[employee.id] ? "Hide" : "Show"}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewEmployee(employee.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditEmployee(employee.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                            title="Edit Employee"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Employee"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Showing {employees.length} employees
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Employee Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">
                {employees.some(emp => emp.employeeId === formData.employeeId) ? 'Edit Employee' : 'Onboard New Employee'}
              </h3>
              <button
                onClick={() => {
                  resetForm()
                  setShowAddForm(false)
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter employee name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="employee@company.com"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID *
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.employeeId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="EMP001"
                />
                {formErrors.employeeId && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.employeeId}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Join Date
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.department ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {formErrors.department && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation *
                </label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.designation ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Designation</option>
                  {designations.map(desg => (
                    <option key={desg} value={desg}>{desg}</option>
                  ))}
                </select>
                {formErrors.designation && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.designation}</p>
                )}
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-900">System Access Credentials</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoGenerate"
                      checked={autoGenerateCredentials}
                      onChange={toggleAutoGenerateCredentials}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor="autoGenerate" className="text-sm text-gray-700">
                      Auto-generate
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.username ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Username for system login"
                      disabled={autoGenerateCredentials}
                    />
                    {formErrors.username && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                    )}
                    {autoGenerateCredentials && (
                      <p className="mt-1 text-xs text-gray-500">
                        Username will be generated from email
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showFormPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Password for system login"
                        disabled={autoGenerateCredentials}
                      />
                      <button
                        type="button"
                        onClick={() => setShowFormPassword(!showFormPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        disabled={autoGenerateCredentials}
                      >
                        {showFormPassword ? <EyeOff size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                    )}
                    {autoGenerateCredentials ? (
                      <p className="mt-1 text-xs text-gray-500">
                        Password will be: {formData.employeeId ? `${formData.employeeId.toLowerCase()}123` : "EMP ID + '123'"}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">
                        Minimum 6 characters required
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    resetForm()
                    setShowAddForm(false)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {employees.some(emp => emp.employeeId === formData.employeeId) ? 'Update Employee' : 'Onboard Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Employee Details</h3>
                <p className="text-sm text-gray-500">View comprehensive employee information</p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Employee Profile Header */}
              <div className="flex items-center gap-4 pb-6 border-b">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={32} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedEmployee.name}</h2>
                  <p className="text-sm text-gray-600">{selectedEmployee.designation}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedEmployee.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedEmployee.status === 'active' ? (
                        <>
                          <CheckCircle size={12} className="mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle size={12} className="mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      EMP ID: {selectedEmployee.employeeId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Employee Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Personal Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email Address</p>
                        <p className="text-sm font-medium text-gray-900">{selectedEmployee.email}</p>
                      </div>
                    </div>
                    {selectedEmployee.phone && (
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Phone Number</p>
                          <p className="text-sm font-medium text-gray-900">{selectedEmployee.phone}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Join Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(selectedEmployee.joinDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Employment Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Department</p>
                        <p className="text-sm font-medium text-gray-900">{selectedEmployee.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Designation</p>
                        <p className="text-sm font-medium text-gray-900">{selectedEmployee.designation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Hash size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Employee ID</p>
                        <p className="text-sm font-medium text-gray-900">{selectedEmployee.employeeId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Access */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">System Access</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Username</p>
                        <div className="flex items-center gap-2">
                          <Shield size={16} className="text-blue-500" />
                          <code className="font-mono text-sm bg-white px-3 py-1.5 rounded border">
                            {selectedEmployee.username}
                          </code>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Password</p>
                        <div className="flex items-center gap-2">
                          <Shield size={16} className="text-green-500" />
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-sm bg-white px-3 py-1.5 rounded border">
                              {showPassword[selectedEmployee.id] ? selectedEmployee.password : "••••••••"}
                            </code>
                            <button
                              onClick={() => togglePasswordVisibility(selectedEmployee.id)}
                              className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {showPassword[selectedEmployee.id] ? "Hide" : "Show"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      <p>Last login: {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Assets */}
              <div className="pt-6 border-t">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Assigned Assets</h4>
                {assets.filter(asset => asset.assignedTo === selectedEmployee.id).length > 0 ? (
                  <div className="space-y-3">
                    {assets
                      .filter(asset => asset.assignedTo === selectedEmployee.id)
                      .map(asset => (
                        <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                            <p className="text-xs text-gray-500">SN: {asset.serialNumber} • {asset.type}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            asset.status === 'assigned' 
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {asset.status}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center py-4 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-sm text-gray-500">No assets assigned to this employee</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    handleEditEmployee(selectedEmployee.id)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}