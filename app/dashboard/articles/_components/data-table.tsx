"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Employee {
  id: string
  name: string
  country: string
  email: string
  company: string
  gender: string
  department: string
  salary: string
  startDate: string
  status: string
  phone: string
  address: string
  manager: string
  team: string
  skills: string
}

const employees: Employee[] = [
  {
    id: "1",
    name: "Lonzo",
    country: "USA",
    email: "Jalyn_Goldner@hotmail.com",
    company: "Acme Inc",
    gender: "male",
    department: "Engineering",
    salary: "$120,000",
    startDate: "2021-03-12",
    status: "Active",
    phone: "(555) 123-4567",
    address: "123 Main St, San Francisco, CA",
    manager: "Sarah Johnson",
    team: "Frontend",
    skills: "React, TypeScript, CSS",
  },
  {
    id: "2",
    name: "Yasmine",
    country: "USA",
    email: "Jermey.Rutherford32@hotmail.com",
    company: "Acme Inc",
    gender: "female",
    department: "Design",
    salary: "$95,000",
    startDate: "2022-01-15",
    status: "Active",
    phone: "(555) 234-5678",
    address: "456 Oak Ave, Seattle, WA",
    manager: "Michael Chen",
    team: "UI/UX",
    skills: "Figma, Sketch, Adobe XD",
  },
  {
    id: "3",
    name: "Dakota",
    country: "USA",
    email: "Berta.Wolff76@gmail.com",
    company: "Acme Inc",
    gender: "female",
    department: "Product",
    salary: "$110,000",
    startDate: "2020-11-05",
    status: "Active",
    phone: "(555) 345-6789",
    address: "789 Pine St, Austin, TX",
    manager: "David Wilson",
    team: "Product Management",
    skills: "Jira, Confluence, Roadmapping",
  },
  {
    id: "4",
    name: "Van",
    country: "USA",
    email: "Destiney76@yahoo.com",
    company: "Acme Inc",
    gender: "female",
    department: "Data",
    salary: "$135,000",
    startDate: "2021-07-22",
    status: "Active",
    phone: "(555) 456-7890",
    address: "101 Maple Dr, Boston, MA",
    manager: "Lisa Rodriguez",
    team: "Data Science",
    skills: "Python, SQL, Machine Learning",
  },
  {
    id: "5",
    name: "Leonie",
    country: "USA",
    email: "Talon29@hotmail.com",
    company: "Acme Inc",
    gender: "female",
    department: "Engineering",
    salary: "$125,000",
    startDate: "2022-02-18",
    status: "Active",
    phone: "(555) 567-8901",
    address: "202 Cedar Ln, Denver, CO",
    manager: "James Taylor",
    team: "Backend",
    skills: "Node.js, Java, AWS",
  },
  {
    id: "6",
    name: "Lonzo",
    country: "USA",
    email: "Jalyn_Goldner@hotmail.com",
    company: "Acme Inc",
    gender: "male",
    department: "Engineering",
    salary: "$120,000",
    startDate: "2021-03-12",
    status: "Active",
    phone: "(555) 123-4567",
    address: "123 Main St, San Francisco, CA",
    manager: "Sarah Johnson",
    team: "Frontend",
    skills: "React, TypeScript, CSS",
  },
  {
    id: "7",
    name: "Yasmine",
    country: "USA",
    email: "Jermey.Rutherford32@hotmail.com",
    company: "Acme Inc",
    gender: "female",
    department: "Design",
    salary: "$95,000",
    startDate: "2022-01-15",
    status: "Active",
    phone: "(555) 234-5678",
    address: "456 Oak Ave, Seattle, WA",
    manager: "Michael Chen",
    team: "UI/UX",
    skills: "Figma, Sketch, Adobe XD",
  },
  {
    id: "8",
    name: "Dakota",
    country: "USA",
    email: "Berta.Wolff76@gmail.com",
    company: "Acme Inc",
    gender: "female",
    department: "Product",
    salary: "$110,000",
    startDate: "2020-11-05",
    status: "Active",
    phone: "(555) 345-6789",
    address: "789 Pine St, Austin, TX",
    manager: "David Wilson",
    team: "Product Management",
    skills: "Jira, Confluence, Roadmapping",
  },
  {
    id: "9",
    name: "Van",
    country: "USA",
    email: "Destiney76@yahoo.com",
    company: "Acme Inc",
    gender: "female",
    department: "Data",
    salary: "$135,000",
    startDate: "2021-07-22",
    status: "Active",
    phone: "(555) 456-7890",
    address: "101 Maple Dr, Boston, MA",
    manager: "Lisa Rodriguez",
    team: "Data Science",
    skills: "Python, SQL, Machine Learning",
  },
  {
    id: "10",
    name: "Leonie",
    country: "USA",
    email: "Talon29@hotmail.com",
    company: "Acme Inc",
    gender: "female",
    department: "Engineering",
    salary: "$125,000",
    startDate: "2022-02-18",
    status: "Active",
    phone: "(555) 567-8901",
    address: "202 Cedar Ln, Denver, CO",
    manager: "James Taylor",
    team: "Backend",
    skills: "Node.js, Java, AWS",
  },
]

export function DataTable() {
  return (
    <div className="rounded-md border">
      {/* The key is to wrap the table in a div with overflow-x-auto */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Skills</TableHead>

              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Skills</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.country}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.company}</TableCell>
                <TableCell>{employee.gender}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.salary}</TableCell>
                <TableCell>{employee.startDate}</TableCell>
                <TableCell>{employee.status}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.address}</TableCell>
                <TableCell>{employee.manager}</TableCell>
                <TableCell>{employee.team}</TableCell>
                <TableCell>{employee.skills}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
