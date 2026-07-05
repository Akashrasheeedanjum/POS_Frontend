"use client"

import { getAllUsers, updateAccess } from "@/lib/actions/user.actions"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"

// Types
export interface UserAccesses {
  productAccess: boolean
  categoryAccess: boolean
  customerAccess: boolean
  supplierAccess: boolean
  salesAccess: boolean
  foldersAccess: boolean
  settingsHelp: boolean
  toolsAccess: boolean
  manageTheStock: boolean
  accessToStores: boolean
  xzReport: boolean
  multiStoreVersion: boolean
  accessToRepairs: boolean
  openingDrawerWithoutSale: boolean
  ticketReminder: boolean
  changePricesAndDiscount: boolean
  addProductForm: boolean
  modifyProductForm: boolean
  _id: boolean|string
}

export interface User {
  _id?: string
  name?: string
  role?: string
  password?: string
  accesses?: any
}

// // Default empty accesses object
export const defaultAccesses: any = {
  productAccess: false,
  categoryAccess: false,
  customerAccess: false,
  supplierAccess: false,
  salesAccess: false,
  foldersAccess: false,
  settingsHelp: false,
  toolsAccess: false,
  manageTheStock: false,
  accessToStores: false,
  xzReport: false,
  multiStoreVersion: false,
  accessToRepairs: false,
  openingDrawerWithoutSale: false,
  ticketReminder: false,
  changePricesAndDiscount: false,
  addProductForm: false,
  modifyProductForm: false,

}

// Context type
interface UserManagementContextType {
  users: User[]
  selectedUser: User | null
  selectUser: (user: User | null) => void
  addUser: (user: User) => void
  updateUser: (user: User) => void
  deleteUser: (id: string|undefined) => void
  updateUserPermissions: (userId: string, accesses: UserAccesses) => void
}

// Create context
const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined)

// Provider component
export function UserManagementProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const fetchUsersData = async () => {
    try {
      const allUsers = await getAllUsers();   
      const filteredUsers = allUsers.filter((user: User) => user.role?.toLowerCase() === "user");
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching Numbering Data:", error)
      toast.error("Failed to fetch Numbering Data")
    }
  }
  // Load initial demo data
  useEffect(() => {
    // This would normally come from an API
    // const initialUsers: User[] = [
    //   {
    //     id: "1",
    //     name: "salman",
    //     password: "Password123!",
    //     accesses: { ...defaultAccesses },
    //   },
    //   {
    //     id: "2",
    //     name: "admin",
    //     password: "Admin456!",
    //     accesses: {
    //       ...defaultAccesses,
    //       productAccess: true,
    //       customerAccess: true,
    //       supplierAccess: true,
    //       salesAccess: true,
    //     },
    //   },
    // ]

    fetchUsersData()
  }, [])

  // Select a user
  const selectUser = (user: User | null) => {
    setSelectedUser(user)
  }

  // Add a new user
  const addUser = (user: User) => {
    setUsers((prev) => [...prev, user])
  }

  // Update a user
  const updateUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((user) => (user._id === updatedUser._id ? updatedUser : user)))

    // Update selected user if it was the one being edited
    if (selectedUser && selectedUser._id === updatedUser._id) {
      setSelectedUser(updatedUser)
    }
  }

  // Delete a user
  const deleteUser = (id: string|undefined) => {
    setUsers((prev) => prev.filter((user) => user._id !== id))

    // Deselect if the deleted user was selected
    if (selectedUser && selectedUser._id === id) {
      setSelectedUser(null)
    }
  }

  // Update user permissions
  const updateUserPermissions = async(userId: string, accesses: UserAccesses) => {
    try {
      const {_id, ...rest} = accesses
      // return
      await updateAccess(userId, rest)
      setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, accesses } : user)))

      // Update selected user if it was the one being edited
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser((prev) => (prev ? { ...prev, accesses } : null))
      }

      toast.success('Accesses updated successfully')
    } catch (error) {
      console.error('Error while updating accesses', error)
      toast.error(`Could not update ${error}`)
    }

  }

  const value = {
    users,
    selectedUser,
    selectUser,
    addUser,
    updateUser,
    deleteUser,
    updateUserPermissions,
  }

  return <UserManagementContext.Provider value={value}>{children}</UserManagementContext.Provider>
}

// Custom hook to use the context
export function useUserManagement() {
  const context = useContext(UserManagementContext)
  if (context === undefined) {
    throw new Error("useUserManagement must be used within a UserManagementProvider")
  }
  return context
}

