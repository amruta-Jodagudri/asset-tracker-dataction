"use client"

import type React from "react"
import { useState } from "react"

interface TableSearchSortProps {
  onSearchChange: (term: string) => void
  onSortChange: (key: string, order: "asc" | "desc") => void
  searchPlaceholder?: string
  sortOptions?: Array<{ key: string; label: string }>
}

export function TableSearchSort({
  onSearchChange,
  onSortChange,
  searchPlaceholder = "Search...",
  sortOptions = [],
}: TableSearchSortProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortKey, setSortKey] = useState<string>(sortOptions[0]?.key || "")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearchChange(value)
  }

  const handleSortKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value
    setSortKey(key)
    onSortChange(key, sortOrder)
  }

  const handleSortOrderChange = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc"
    setSortOrder(newOrder)
    onSortChange(sortKey, newOrder)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search Input */}
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={handleSearch}
        className="flex-1 px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Sort Controls */}
      {sortOptions.length > 0 && (
        <div className="flex gap-2">
          <select
            value={sortKey}
            onChange={handleSortKeyChange}
            className="px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card"
          >
            <option value="">Sort by...</option>
            {sortOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleSortOrderChange}
            className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors"
            title={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      )}
    </div>
  )
}
