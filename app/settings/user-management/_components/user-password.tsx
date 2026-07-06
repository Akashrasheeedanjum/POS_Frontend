"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Pencil, Trash2, Plus } from "lucide-react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserAccesses } from "./user-permissions"

export interface User {
  id: string
  name: string
  password: string
  role: string
}

export interface UserWithAccesses extends User {
  accesses: UserAccesses
}

interface UserManagementProps {
  onUserSelect: (user: UserWithAccesses | null) => void
  selectedUser: UserWithAccesses | null
  onUpdateUser: (user: UserWithAccesses) => void
}

// Default empty accesses object
const defaultAccesses: UserAccesses = {
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

export default function UserPassword({ onUserSelect, selectedUser, onUpdateUser }: UserManagementProps) {
  const [users, setUsers] = useState<UserWithAccesses[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserWithAccesses | null>(null)
  const [newUser, setNewUser] = useState<Omit<UserWithAccesses, "id">>({
    name: "",
    password: "",
    role: "user",
    accesses: { ...defaultAccesses },
  })

  // Load initial demo data
  useEffect(() => {
    // This would normally come from an API
    const initialUsers: UserWithAccesses[] = [
      {
        id: "1",
        name: "salman",
        password: "Password123!",
        role: "user",
        accesses: { ...defaultAccesses },
      },
      {
        id: "2",
        name: "admin",
        password: "Admin456!",
        role: "admin",
        accesses: {
          ...defaultAccesses,
          productAccess: true,
          customerAccess: true,
          supplierAccess: true,
          salesAccess: true,
        },
      },
    ]
    setUsers(initialUsers)
  }, [])

  const handleAddUser = () => {
    if (newUser.name && newUser.password) {
      const newUserWithId: UserWithAccesses = {
        id: Date.now().toString(),
        ...newUser,
      }
      setUsers([...users, newUserWithId])
      setNewUser({
        name: "",
        password: "",
        role: "user",
        accesses: { ...defaultAccesses },
      })
      setIsAddOpen(false)
    }
  }

  const handleEditUser = () => {
    if (currentUser && currentUser.name && currentUser.password) {
      const updatedUsers = users.map((user) => (user.id === currentUser.id ? currentUser : user))
      setUsers(updatedUsers)
      setIsEditOpen(false)

      // Update selected user if it was the one being edited
      if (selectedUser && selectedUser.id === currentUser.id) {
        onUserSelect(currentUser)
        onUpdateUser(currentUser)
      }
    }
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  // Check if the selected user still exists after deletion
  useEffect(() => {
    if (selectedUser && !users.some((user) => user.id === selectedUser.id)) {
      onUserSelect(null)
    }
  }, [users, selectedUser, onUserSelect])

  const handleRowClick = (user: UserWithAccesses) => {
    onUserSelect(user)
  }

  const openEditModal = (user: UserWithAccesses, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row selection when clicking edit
    setCurrentUser(user)
    setIsEditOpen(true)
  }

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row selection when clicking delete
    handleDeleteUser(id)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> <div className="font-light text-xs md:text-base">Add New User</div>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Enter the details of the new user.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-4">
                <Label htmlFor="name" className="col-span-1 text-start">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-4">
                <Label htmlFor="password" className="text-start col-span-1">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-4">
                <Label htmlFor="role" className="text-start col-span-1">
                  Role
                </Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddUser}>
                Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          {users.length === 0 && <TableCaption className="text-center">No users available</TableCaption>}
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                onClick={() => handleRowClick(user)}
                className={`cursor-pointer ${selectedUser?.id === user.id ? "bg-muted" : ""} hover:bg-muted/50`}
              >
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={(e) => openEditModal(user, e)}>
                      <div className="border border-green-500 p-1 rounded-md">
                        <Pencil className="h-4 w-4 text-green-700" />
                      </div>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => handleDeleteClick(user.id, e)}>
                      <div className="border border-red-500 p-1 rounded-md">
                        <Trash2 className="h-4 w-4 text-red-700" />
                      </div>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update the user details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={currentUser?.name || ""}
                onChange={(e) => setCurrentUser(currentUser ? { ...currentUser, name: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-4">
              <Label htmlFor="edit-password" className="text-right">
                Password
              </Label>
              <Input
                id="edit-password"
                type="password"
                value={currentUser?.password || ""}
                onChange={(e) => setCurrentUser(currentUser ? { ...currentUser, password: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-4">
              <Label htmlFor="edit-role" className="text-right">
                Role
              </Label>
              <Select
                value={currentUser?.role || "user"}
                onValueChange={(value) => setCurrentUser(currentUser ? { ...currentUser, role: value } : null)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

