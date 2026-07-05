import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Workflow',
    url: '/dashboard/scrap-purchase',
    icon: 'product',
    isActive: false,
    items: [
      {
        title: '1. Scrap Purchase',
        url: '/dashboard/scrap-purchase',
        icon: 'product',
      },
      {
        title: '2. Production',
        url: '/dashboard/production',
        icon: 'product',
      },
      {
        title: '3. Create Product',
        url: '/dashboard/articles',
        icon: 'product',
      },
      {
        title: '4. POS Sale',
        url: '/dashboard/sales',
        icon: 'dashboard',
      },
      {
        title: '5. Reports & PNL',
        url: '/folder/analysis/pakistanReports',
        icon: 'dashboard',
      },
    ],
  },
    {
    title: 'Sales Management',
    url: '/dashboard/sales',
    icon: 'dashboard',
    isActive: false,
    items: [] 
  },
    {
    title: 'Folder',
    url: '/folder',
    icon: 'dashboard',
    isActive: false,
    items: [
            {
        title: 'Document & Sales',
        url: '/folder/documentAndSales/documents',
        icon: 'userPen',
      },
        {
        title: 'Analysis',
        url: '/folder/analysis/bestSellers',
        icon: 'userPen',
      },
        {
        title: 'Financial & Journals',
        url: '/folder/financialAndJournals/bookIncome',
        icon: 'userPen',
      },
    ] 
  },
    {
    title: 'New Document',
    url: '/dashboard/documents',
    icon: 'product',
    isActive: false,
    items: [] // No child items
  },
    {
    title: 'Last Closing',
    url: '/dashboard/lastClosing',
    icon: 'product',
    isActive: false,
    items: [] // No child items
  },
  // {
  //   title: 'Employee',
  //   url: '/dashboard/employee',
  //   icon: 'user',
  //   isActive: false,
  //   items: [] // No child items
  // },
  // {
  //   title: 'Product',
  //   url: '/dashboard/product',
  //   icon: 'product',
  //   isActive: false,
  //   items: [] // No child items
  // },
  {
    title: 'Articles',
    url: '/dashboard/articles',
    icon: 'product',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Stock Management',
    url: '/dashboard/stockManagement',
    icon: 'product',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Suppliers',
    url: '/dashboard/suppliers',
    icon: 'customers',
    isActive: false,
    items: []
  },
  {
    title: 'Customers',
    url: '/customers',
    icon: 'customers',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: 'Users',
        url: '/settings/user-registration',
        icon: 'userPen'
      },
      {
        title: 'User Management',
        url: '/settings/user-management',
        icon: 'userPen'
      },
      {
        title: 'Printer',
        url: '/settings/printer',
        icon: 'userPen'
      },
      {
        title: 'Financial Parameters',
        url: '/settings/financial-parameters',
        icon: 'userPen'
      },
      {
        title: 'Numbering',
        url: '/settings/numbering',
        icon: 'userPen'
      },
      {
        title: 'Mail Account',
        url: '/settings/mail-account',
        icon: 'userPen'
      },
    ]
  },
  // {
  //   title: 'Account',
  //   url: '#', // Placeholder as there is no direct link for the parent
  //   icon: 'billing',
  //   isActive: false,

  //   items: [
  //     {
  //       title: 'Profile',
  //       url: '/dashboard/profile',
  //       icon: 'userPen'
  //     },
  //     {
  //       title: 'Login',
  //       url: '/',
  //       icon: 'login'
  //     }
  //   ]
  // },
  // {
  //   title: 'Kanban',
  //   url: '/dashboard/kanban',
  //   icon: 'kanban',
  //   isActive: false,
  //   items: [] // No child items
  // }
];

export const settingNavItems: NavItem[] = [
  {
    title: 'Users',
    url: '/settings/user-registration',
    icon: 'dashboard',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Financial Parameters',
    url: '/settings/financial-parameters',
    icon: 'dashboard',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Printer',
    url: '/settings/printer',
    icon: 'dashboard',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'User Management',
    url: '/settings/user-management',
    icon: 'dashboard',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Numbering',
    url: '/settings/numbering',
    icon: 'userPen',
    isActive: false,
  },
  {
    title: 'Mail Account',
    url: '/settings/mail-account',
    icon: 'userPen',
    isActive: false,
  },
  {
    title: 'Employee',
    url: '/dashboard/employee',
    icon: 'user',
    isActive: false,
    items: [] // No child items
  },
   
       
   
   
  // {
  //   title: 'Kanban',
  //   url: '/dashboard/kanban',
  //   icon: 'kanban',
  //   isActive: false,
  //   items: [] // No child items
  // }
];


export const scrollablePages:any[]=[
"/settings/printer"

]


export const folderNavItems: NavItem[] = [
  {
    title: 'Documents & Sales',
    url: '/folder/documentAndSales',
    icon: 'dashboard',
    isActive: false,
    items: [
          {
        title: 'Documents',
        url: '/folder/documentAndSales/documents',
        icon: 'userPen'
      },
        {
        title: 'Receipts',
        url: '/folder/documentAndSales/receipts',
        icon: 'userPen'
      },
        {
        title: 'Sales Analisis',
        url: '/folder/documentAndSales/salesAnalisis',
        icon: 'userPen'
      },
    ] 
  },
    {
    title: 'Analysis',
    url: '/folder/analysis',
    icon: 'dashboard',
    isActive: false,
    items: [
      {
        title: 'Pakistan Reports (PNL)',
        url: '/folder/analysis/pakistanReports',
        icon: 'userPen'
      },
        {
        title: 'Best Sellers',
        url: '/folder/analysis/bestSellers',
        icon: 'userPen'
      },

    ] 
  },
    {
    title: 'Financial & journals',
    url: '/folder/financialAndJournals',
    icon: 'dashboard',
    isActive: false,
    items: [
          {
        title: 'Book Income',
        url: '/folder/financialAndJournals/bookIncome',
        icon: 'userPen'
      },
        {
        title: 'Payment Method',
        url: '/folder/financialAndJournals/paymentMethod',
        icon: 'userPen'
      },
        {
        title: 'Grouped Payment Method',
        url: '/folder/financialAndJournals/groupedPayment',
        icon: 'userPen'
      },
        {
        title: 'Sales Journal',
        url: '/folder/financialAndJournals/salesJournal',
        icon: 'userPen'
      },
        {
        title: 'Tickets de clotures',
        url: '/folder/financialAndJournals/ticketsDeClotures',
        icon: 'userPen'
      },
        {
        title: 'Purchase Journal',
        url: '/folder/analysis/pakistanReports',
        icon: 'userPen'
      },
        {
        title: 'Cash Book',
        url: '/folder/financialAndJournals/cashBook',
        icon: 'userPen'
      },

    ] 
  }
];
