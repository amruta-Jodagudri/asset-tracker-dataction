"use client"

import type React from "react"

import { useAuth } from "@/lib/context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"

export default function AdminProfile() {
  const { user } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(
    user
      ? {
          name: user.name,
          email: user.email,
          designation: user.designation,
          department: user.department,
          employeeId: user.employeeId,
        }
      : null,
  )

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  if (!user || !formData) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = () => {
    setIsEditing(false)
    alert("Profile updated successfully!")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your profile information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-lg shadow border border-border p-8 max-w-2xl">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b border-border">
            <img
              src={user.profileImage || "/placeholder.svg"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-primary"
            />
            <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
            <p className="text-muted-foreground">{user.designation}</p>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border border-border rounded-md ${
                    isEditing ? "focus:outline-none focus:ring-2 focus:ring-primary" : "bg-secondary text-foreground"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border border-border rounded-md ${
                    isEditing ? "focus:outline-none focus:ring-2 focus:ring-primary" : "bg-secondary text-foreground"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border border-border rounded-md ${
                    isEditing ? "focus:outline-none focus:ring-2 focus:ring-primary" : "bg-secondary text-foreground"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border border-border rounded-md ${
                    isEditing ? "focus:outline-none focus:ring-2 focus:ring-primary" : "bg-secondary text-foreground"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  readOnly
                  className="w-full px-4 py-2 border border-border rounded-md bg-secondary text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Role</label>
                <input
                  type="text"
                  value={user.role}
                  readOnly
                  className="w-full px-4 py-2 border border-border rounded-md bg-secondary text-foreground capitalize"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-8 pt-8 border-t border-border justify-end">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all font-medium"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all font-medium"
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
