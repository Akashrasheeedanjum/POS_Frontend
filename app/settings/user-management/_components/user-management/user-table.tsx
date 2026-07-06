"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Pencil, Trash2, Plus, Eye, EyeOff } from "lucide-react"
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
import { useUserManagement, defaultAccesses, User } from "../UserManagementContext"
import { createUser, deleteTheUser, updateTheUser } from "@/lib/actions/user.actions"
import { toast } from "sonner"
import { ClipLoader } from "react-spinners"
import DeleteConfirmationModal from "@/components/modal/DeleteConfirmationModal"


export function UserTable() {
  const { users, selectedUser, selectUser, addUser, updateUser, deleteUser } = useUserManagement()

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ name: string|undefined; password: string|undefined } | null>(null)
  const [newUser, setNewUser] = useState<{ name: string; password: string }>({
    name: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [visiblePasswordId, setVisiblePasswordId] = useState<string | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  const [userToDelete, setUserToDelete] = useState<User|null>()
  const [openUserDeleteModal, setOpenUserDeleteModal] = useState(false)
  const [isUserDeleting, setIsUserDeleting] = useState(false)

  // Handle clicks outside the table to hide passwords
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        setVisiblePasswordId(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Hide password when selected user changes
  useEffect(() => {
    setVisiblePasswordId(null)
  }, [selectedUser])

  const handleAddUser = async() => {
    try {
      if (newUser.name.trim() && newUser.password.trim()) {
        if(newUser.password.trim().length < 6){
          toast.error('Password must be atleast 6 characters long')
          return;
        }
        const newUserData={
            name: newUser.name.trim(),
            role: "user",
            password: newUser.password.trim(),
            accesses: { ...defaultAccesses },
          }

      const createdUser =  await createUser(newUserData)
      addUser(createdUser?.user)
      setNewUser({ name: "", password: "" })
      setIsAddOpen(false)
      toast.success('User Created successfully')
    }else{
      toast.error('Please Provide both fields without just spaces')
      return;
    }
    } catch (error) {
      console.error('Error while creating a new User', error)
      toast.error(`${error}`)
    }

  }


  const handleEditUser = async() => {
    try {
      if (currentUser && selectedUser && currentUser.name && currentUser.password) {
        const updatedUser = {
          ...selectedUser,
          name: currentUser.name,
          password: currentUser.password,
        }
        const {_id, ...updatedData} = updatedUser
        const freshUser = await updateTheUser(_id, updatedData)
        updateUser(freshUser)
        setIsEditOpen(false)
        toast.success('User Updated successfully')
      }
    } catch (error) {
      console.error('Error while updating User', error)
      toast.error(`${error}`)
    }

  }

  const handleRowClick = (user: (typeof users)[0]) => {
    selectUser(user)
    // Hide any visible password when selecting a different user
    if (visiblePasswordId && visiblePasswordId !== user._id) {
      setVisiblePasswordId(null)
    }
  }

  const openEditModal = (user: (typeof users)[0], e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row selection when clicking edit
    selectUser(user)
    setCurrentUser({
      name: user.name,
      password: user.password,
    })
    setIsEditOpen(true)
  }

  const handleDeleteUserRequest = (user:User) => {
      setUserToDelete(user)
      setOpenUserDeleteModal(true)
  }

  // const handleDeleteClick = async(id: string, e: React.MouseEvent) => {
  const handleDeleteClick = async() => {
    // e.stopPropagation() // Prevent row selection when clicking delete
    const id = userToDelete?._id
    setIsUserDeleting(true)
    try {
      // setDeletingUserId(id)
      await deleteTheUser(id)
      deleteUser(id)
      toast.success('User deleted successfully')
      // setDeletingUserId(null)
    } catch (error) {
      // setDeletingUserId(null)
      console.error('Error while deleting User', error)
      toast.error(`${error}`)
    }finally{
      setOpenUserDeleteModal(false)
      setUserToDelete(null)
      setIsUserDeleting(false)
    }
  }

  const togglePasswordVisibility = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row selection when clicking the eye icon
    setVisiblePasswordId(visiblePasswordId === userId ? null : userId)
  }

  // Function to mask password
  const maskPassword = (password: string) => {
    return "•".repeat(Math.min(password?.length, 8))
  }

  
  const toggleShowPassword = () => setShowPassword(prev => !prev);
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
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddUser}>
                Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border" ref={tableRef}>
        <Table>
          {users?.length === 0 && <TableCaption className="text-center">No users available</TableCaption>}
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Password</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow
                key={user._id}
                onClick={() => handleRowClick(user)}
                className={`cursor-pointer ${selectedUser?._id === user._id ? "bg-muted" : ""} hover:bg-muted/50`}
              >
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="flex items-center space-x-2">
                  <span className="font-mono">
                    {visiblePasswordId === user._id ? user.password : maskPassword(String(user.password))}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => togglePasswordVisibility(String(user._id), e)}
                    className="h-6 w-6"
                  >
                    {visiblePasswordId === user._id ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={(e) => openEditModal(user, e)}>
                      <div className="border border-green-500 p-1 rounded-md">
                        <Pencil className="h-4 w-4 text-green-700" />
                      </div>
                    </Button>
                    {/* <Button variant="ghost" size="icon" onClick={(e) => handleDeleteClick(user._id, e)}> */}
                    <Button variant="ghost" size="icon" onClick={(e) => handleDeleteUserRequest(user)}>
                      {/* {deletingUserId === user._id ? (
                        <ClipLoader
                      color="#d61313"
                      size={18}
                      speedMultiplier={1}
                      />
                      ):(  */}
                        <div className="border border-red-500 p-1 rounded-md">
                        <Trash2 className="h-4 w-4 text-red-700" />
                      </div>
                      {/* )} */}
                        
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmationModal 
      open={openUserDeleteModal}
      onClose={() => setOpenUserDeleteModal(false)}
      onConfirm={handleDeleteClick}
      message={`Do you want to delete User: ${userToDelete?.name}?`}
      loadingState={isUserDeleting}
      />

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
      <div className="relative col-span-3">
        <Input
          id="edit-password"
          type={showPassword ? "text" : "password"}
          value={currentUser?.password || ""}
          onChange={(e) => setCurrentUser(currentUser ? { ...currentUser, password: e.target.value } : null)}
          className="col-span-3 pr-10" // extra padding on right for icon
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute inset-y-0 right-2 flex items-center"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-500" />
          ) : (
            <Eye className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>
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

