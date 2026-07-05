"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Save, RotateCcw } from "lucide-react"
import { useUserManagement, type UserAccesses } from "../UserManagementContext"

// Map permission keys to display names and columns
const permissionConfig = [
  // Left column
  { key: "productAccess", name: "Products access", column: "left" },
  { key: "customerAccess", name: "Customer access", column: "left" },
  { key: "supplierAccess", name: "Supplier access", column: "left" },
  { key: "salesAccess", name: "Sales access", column: "left" },
  { key: "foldersAccess", name: "Folders access", column: "left" },
  { key: "settingsHelp", name: "Settings - Help", column: "left" },
  { key: "toolsAccess", name: "Tools access", column: "left" },
  { key: "manageTheStock", name: "Manage the stock", column: "left" },
  { key: "accessToStores", name: "Access to Stores", column: "left" },

  // Right column
  { key: "xzReport", name: "X-Z Report", column: "right" },
  {
    key: "multiStoreVersion",
    name: "Multi-store version Limited cash register closure - the ticket is not printed",
    column: "right",
  },
  { key: "accessToRepairs", name: "Access to Repairs", column: "right" },
  { key: "openingDrawerWithoutSale", name: "Opening drawer without sale", column: "right" },
  { key: "ticketReminder", name: "Ticket reminder", column: "right" },
  { key: "changePricesAndDiscount", name: "Change prices and discounts", column: "right" },
  { key: "addProductForm", name: "Add product form", column: "right" },
  { key: "modifyProductForm", name: "Edit / Delete product form", column: "right" },
] as const

// Composite components for permissions
const PermissionItem = ({
  name,
  isHighlighted = false,
  isChecked,
  onChange,
}: {
  name: string
  isHighlighted?: boolean
  isChecked: boolean
  onChange: () => void
}) => (
  <div className="flex items-center justify-between">
    <span className={isHighlighted ? "text-purple-600 font-medium" : ""}>{name}</span>
    <div className="flex items-center space-x-2">
      <Switch checked={isChecked} onCheckedChange={onChange} />
      <span className="text-sm text-gray-500 w-8">{isChecked ? "on" : "off"}</span>
    </div>
  </div>
)

const MultiStorePermissionItem = ({
  isChecked,
  onChange,
}: {
  isChecked: boolean
  onChange: () => void
}) => (
  <div className="flex items-center justify-between">
    <div className="flex flex-col">
      <span className="text-purple-600 font-medium">Multi-store version</span>
      <span>Limited cash register closure - the ticket is not printed</span>
    </div>
    <div className="flex items-center space-x-2">
      <Switch checked={isChecked} onCheckedChange={onChange} />
      <span className="text-sm text-gray-500 w-8">{isChecked ? "on" : "off"}</span>
    </div>
  </div>
)

export function UserPermissions() {
  const { selectedUser, updateUserPermissions } = useUserManagement()
  const [currentAccesses, setCurrentAccesses] = useState<UserAccesses | null>(null)
  const [originalAccesses, setOriginalAccesses] = useState<UserAccesses | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  // Update local state when selected user changes
  useEffect(() => {
    if (selectedUser) {
      setCurrentAccesses(selectedUser.accesses)
      setOriginalAccesses(selectedUser.accesses)
      setIsDirty(false)
    } else {
      setCurrentAccesses(null)
      setOriginalAccesses(null)
      setIsDirty(false)
    }
  }, [selectedUser])

  // Don't render anything if no user is selected or accesses aren't loaded
  if (!selectedUser || !currentAccesses) {
    return null
  }

  const togglePermission = (key: keyof UserAccesses) => {
    if (!currentAccesses) return

    const updatedAccesses = {
      ...currentAccesses,
      [key]: !currentAccesses[key],
    }

    setCurrentAccesses(updatedAccesses)
    setIsDirty(JSON.stringify(updatedAccesses) !== JSON.stringify(originalAccesses))
  }

  const checkAll = () => {
    if (!currentAccesses) return

    const updatedAccesses = { ...currentAccesses }
    ;(Object.keys(updatedAccesses) as Array<keyof UserAccesses>).forEach((key) => {
      updatedAccesses[key] = true
    })

    setCurrentAccesses(updatedAccesses)
    setIsDirty(JSON.stringify(updatedAccesses) !== JSON.stringify(originalAccesses))
  }

  const uncheckAll = () => {
    if (!currentAccesses) return

    const updatedAccesses = { ...currentAccesses }
    ;(Object.keys(updatedAccesses) as Array<keyof UserAccesses>).forEach((key) => {
      updatedAccesses[key] = false
    })

    setCurrentAccesses(updatedAccesses)
    setIsDirty(JSON.stringify(updatedAccesses) !== JSON.stringify(originalAccesses))
  }

  const resetChanges = () => {
    if (originalAccesses) {
      setCurrentAccesses(originalAccesses)
      setIsDirty(false)
    }
  }

  const saveChanges = () => {
    if (selectedUser && currentAccesses) {
      updateUserPermissions(String(selectedUser._id), currentAccesses)
      setOriginalAccesses(currentAccesses)
      setIsDirty(false)
    }
  }

  const leftColumnPermissions = permissionConfig.filter((p) => p.column === "left")
  const rightColumnPermissions = permissionConfig.filter((p) => p.column === "right")

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-medium mb-4 md:mb-0">
          User access for <span className="text-purple-600 font-semibold">{selectedUser?.name?.toUpperCase()}</span>
        </h1>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={uncheckAll}
            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            All uncheck
          </Button>
          <Button
            variant="outline"
            onClick={checkAll}
            className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
          >
            All check
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 rounded-md border p-6 mb-6">
        {/* Left Column */}
        <div className="space-y-4">
          {leftColumnPermissions.map((permission) => (
            <PermissionItem
              key={permission.key}
              name={permission.name}
              isHighlighted={permission.key === "accessToStores"}
              isChecked={currentAccesses[permission.key]}
              onChange={() => togglePermission(permission.key)}
            />
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {rightColumnPermissions.map((permission) =>
            permission.key === "multiStoreVersion" ? (
              <MultiStorePermissionItem
                key={permission.key}
                isChecked={currentAccesses[permission.key]}
                onChange={() => togglePermission(permission.key)}
              />
            ) : (
              <PermissionItem
                key={permission.key}
                name={permission.name}
                isChecked={currentAccesses[permission.key]}
                onChange={() => togglePermission(permission.key)}
              />
            ),
          )}
        </div>
      </div>

      {/* Action buttons - only show when changes are made */}
      {isDirty && (
        <div className="flex justify-end space-x-4 mb-20">
          <Button variant="outline" onClick={resetChanges} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={saveChanges} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  )
}

