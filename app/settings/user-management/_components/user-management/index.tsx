"use client"

import { UserTable } from "./user-table"
import { UserPermissions } from "./user-permissions"
import { UserManagementProvider } from "../UserManagementContext"

export function UserManagement() {
  return (
    <UserManagementProvider>
      {/* <div className="max-h-[100vh] overflow-auto"> */}
      <div className="h-[calc(100dvh-56px)] overflow-y-auto">
        <UserTable />
        <UserPermissions />
      </div>
    </UserManagementProvider>
  )
}

