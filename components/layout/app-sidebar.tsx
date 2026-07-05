// 'use client';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger
// } from '@/components/ui/collapsible';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu';
// import { Separator } from '@/components/ui/separator';
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarInset,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
//   SidebarProvider,
//   SidebarRail,
//   SidebarTrigger
// } from '@/components/ui/sidebar';
// import {
//   BadgeCheck,
//   Bell,
//   ChevronRight,
//   ChevronsUpDown,
//   CreditCard,
//   GalleryVerticalEnd,
//   LogOut
// } from 'lucide-react';
// import { useSession } from 'next-auth/react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import * as React from 'react';
// import { Breadcrumbs } from '../breadcrumbs';
// import { Icons } from '../icons';
// import SearchInput from '../search-input';
// import ThemeToggle from './ThemeToggle/theme-toggle';
// import { UserNav } from './user-nav';
// import { NavItem } from '@/types';

// export const company = {
//   name: 'Acme Inc',
//   logo: GalleryVerticalEnd,
//   plan: 'Enterprise'
// };

// export default function AppSidebar({
//   children,
//   navItems
// }: {
//   children: React.ReactNode;
//   navItems:NavItem[];
// }) {
//   const [mounted, setMounted] = React.useState(false);
//   const { data: session } = useSession();
//   const pathname = usePathname();
//   // Only render after first client-side mount
//   React.useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return null; // or a loading skeleton
//   }

//   return (
//     <SidebarProvider className="flex h-screen overflow-hidden">
//       <Sidebar collapsible="icon">
//         <SidebarHeader>
//           <div className="flex gap-2 py-2 text-sidebar-accent-foreground ">
//             <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
//               <company.logo className="size-4" />
//             </div>
//             <div className="grid flex-1 text-left text-sm leading-tight">
//               <span className="truncate font-semibold">{company.name}</span>
//               <span className="truncate text-xs">{company.plan}</span>
//             </div>
//           </div>
//         </SidebarHeader>
//         <SidebarContent className="overflow-x-hidden">
//           <SidebarGroup>
//             <SidebarGroupLabel>Overview</SidebarGroupLabel>
//             <SidebarMenu>
//               {navItems.map((item) => {
//                 const Icon = item.icon ? Icons[item.icon] : Icons.logo;
//                 return item?.items && item?.items?.length > 0 ? (
//                   <Collapsible
//                     key={item.title}
//                     asChild
//                     defaultOpen={item.isActive}
//                     className="group/collapsible"
//                   >
//                     <SidebarMenuItem>
//                       <CollapsibleTrigger asChild>
//                         <SidebarMenuButton
//                           tooltip={item.title}
//                           isActive={pathname === item.url}
//                         >
//                           {item.icon && <Icon />}
//                           <span>{item.title}</span>
//                           <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//                         </SidebarMenuButton>
//                       </CollapsibleTrigger>
//                       <CollapsibleContent>
//                         <SidebarMenuSub>
//                           {item.items?.map((subItem) => (
//                             <SidebarMenuSubItem key={subItem.title}>
//                               <SidebarMenuSubButton
//                                 asChild
//                                 isActive={pathname === subItem.url}
//                               >
//                                 <Link href={subItem.url}>
//                                   <span>{subItem.title}</span>
//                                 </Link>
//                               </SidebarMenuSubButton>
//                             </SidebarMenuSubItem>
//                           ))}
//                         </SidebarMenuSub>
//                       </CollapsibleContent>
//                     </SidebarMenuItem>
//                   </Collapsible>
//                 ) : (
//                   <SidebarMenuItem key={item.title}>
//                     <SidebarMenuButton
//                       asChild
//                       tooltip={item.title}
//                       isActive={pathname === item.url}
//                     >
//                       <Link href={item.url}>
//                         <Icon />
//                         <span>{item.title}</span>
//                       </Link>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 );
//               })}
//             </SidebarMenu>
//           </SidebarGroup>
//         </SidebarContent>
//         <SidebarFooter>
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <SidebarMenuButton
//                     size="lg"
//                     className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//                   >
//                     <Avatar className="h-8 w-8 rounded-lg">
//                       <AvatarImage
//                         src={session?.user?.image || ''}
//                         alt={session?.user?.name || ''}
//                       />
//                       <AvatarFallback className="rounded-lg">
//                         {session?.user?.name?.slice(0, 2)?.toUpperCase() ||
//                           'CN'}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="grid flex-1 text-left text-sm leading-tight">
//                       <span className="truncate font-semibold">
//                         {session?.user?.name || ''}
//                       </span>
//                       <span className="truncate text-xs">
//                         {session?.user?.email || ''}
//                       </span>
//                     </div>
//                     <ChevronsUpDown className="ml-auto size-4" />
//                   </SidebarMenuButton>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent
//                   className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
//                   side="bottom"
//                   align="end"
//                   sideOffset={4}
//                 >
//                   <DropdownMenuLabel className="p-0 font-normal">
//                     <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                       <Avatar className="h-8 w-8 rounded-lg">
//                         <AvatarImage
//                           src={session?.user?.image || ''}
//                           alt={session?.user?.name || ''}
//                         />
//                         <AvatarFallback className="rounded-lg">
//                           {session?.user?.name?.slice(0, 2)?.toUpperCase() ||
//                             'CN'}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="grid flex-1 text-left text-sm leading-tight">
//                         <span className="truncate font-semibold">
//                           {session?.user?.name || ''}
//                         </span>
//                         <span className="truncate text-xs">
//                           {' '}
//                           {session?.user?.email || ''}
//                         </span>
//                       </div>
//                     </div>
//                   </DropdownMenuLabel>
//                   <DropdownMenuSeparator />

//                   <DropdownMenuGroup>
//                     <DropdownMenuItem>
//                       <BadgeCheck />
//                       Account
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>
//                       <CreditCard />
//                       Billing
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>
//                       <Bell />
//                       Notifications
//                     </DropdownMenuItem>
//                   </DropdownMenuGroup>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem>
//                     <LogOut />
//                     Log out
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         </SidebarFooter>
//         <SidebarRail />
//       </Sidebar>
//       <SidebarInset className="flex flex-col flex-1">
//         <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
//           <div className="flex items-center gap-2 px-4">
//             <SidebarTrigger className="-ml-1" />
//             <Separator orientation="vertical" className="mr-2 h-4" />
//             <Breadcrumbs />
//           </div>
//           <div className=" hidden w-1/3 items-center gap-2 px-4 md:flex ">
//             <SearchInput />
//           </div>
//           <div className="flex items-center gap-2 px-4">
//             <UserNav />
//             <ThemeToggle />
//           </div>
//         </header>
//         {/* page main content */}
//               {/* content wrapper with scrollable children */}
//       <div className="flex-1 overflow-y-auto px-4 py-2">
//         {children}
//       </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }




// 'use client';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger
// } from '@/components/ui/collapsible';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu';
// import { Separator } from '@/components/ui/separator';
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarInset,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
//   SidebarProvider,
//   SidebarRail,
//   SidebarTrigger,
//   useSidebar
// } from '@/components/ui/sidebar';
// import {
//   BadgeCheck,
//   Bell,
//   ChevronRight,
//   ChevronsUpDown,
//   CreditCard,
//   GalleryVerticalEnd,
//   LogOut
// } from 'lucide-react';
// import { useSession } from 'next-auth/react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import * as React from 'react';
// import { Breadcrumbs } from '../breadcrumbs';
// import { Icons } from '../icons';
// import SearchInput from '../search-input';
// import ThemeToggle from './ThemeToggle/theme-toggle';
// import { UserNav } from './user-nav';
// import { NavItem } from '@/types';


// export const company = {
//   name: 'Acme Inc',
//   logo: GalleryVerticalEnd,
//   plan: 'Enterprise'
// };

// export default function AppSidebar({
//   children,
//   navItems
// }: {
//   children: React.ReactNode;
//   navItems: NavItem[];
// }) {
//   const [mounted, setMounted] = React.useState(false);
//   const { data: session } = useSession();
//   const pathname = usePathname();
//   // Only render after first client-side mount
//   React.useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return null; // or a loading skeleton
//   }

//   return (
//     <SidebarProvider>
//       <SidebarWithContent navItems={navItems} session={session}>
//         {children}
//       </SidebarWithContent>
//     </SidebarProvider>
//   );
// }






// function SidebarWithContent({
//   navItems,
//   session,
//   children
// }: {
//   navItems: NavItem[];
//   session: any;
//   children: React.ReactNode;
// }) {
//   const { open } = useSidebar(); // ✅ Now inside SidebarProvider
//   const pathname = usePathname();

//   const paths = ['/customers', '/dashboard/articles']
//   return (
//     <>
//       <Sidebar collapsible="icon">
//         <SidebarHeader>
//           <div className="flex gap-2 py-2 text-sidebar-accent-foreground ">
//             <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
//               <company.logo className="size-4" />
//             </div>
//             <div className="grid flex-1 text-left text-sm leading-tight">
//               <span className="truncate font-semibold">{company.name}</span>
//               <span className="truncate text-xs">{company.plan}</span>
//             </div>
//           </div>
//         </SidebarHeader>
//         <SidebarContent className="overflow-x-hidden">
//           <SidebarGroup>
//             <SidebarGroupLabel>Overview</SidebarGroupLabel>
//             <SidebarMenu>
//               {navItems.map((item) => {
//                 const Icon = item.icon ? Icons[item.icon] : Icons.logo;
//                 return item?.items && item?.items?.length > 0 ? (
//                   <Collapsible
//                     key={item.title}
//                     asChild
//                     defaultOpen={item.isActive}
//                     className="group/collapsible"
//                   >
//                     <SidebarMenuItem>
//                       <CollapsibleTrigger asChild>
//                         <SidebarMenuButton
//                           tooltip={item.title}
//                           isActive={pathname === item.url}
//                         >
//                           {item.icon && <Icon />}
//                           <span>{item.title}</span>
//                           <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//                         </SidebarMenuButton>
//                       </CollapsibleTrigger>
//                       <CollapsibleContent>
//                         <SidebarMenuSub>
//                           {item.items?.map((subItem) => (
//                             <SidebarMenuSubItem key={subItem.title}>
//                               <SidebarMenuSubButton
//                                 asChild
//                                 isActive={pathname === subItem.url}
//                               >
//                                 <Link href={subItem.url}>
//                                   <span>{subItem.title}</span>
//                                 </Link>
//                               </SidebarMenuSubButton>
//                             </SidebarMenuSubItem>
//                           ))}
//                         </SidebarMenuSub>
//                       </CollapsibleContent>
//                     </SidebarMenuItem>
//                   </Collapsible>
//                 ) : (
//                   <SidebarMenuItem key={item.title}>
//                     <SidebarMenuButton
//                       asChild
//                       tooltip={item.title}
//                       isActive={pathname === item.url}
//                     >
//                       <Link href={item.url}>
//                         <Icon />
//                         <span>{item.title}</span>
//                       </Link>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 );
//               })}
//             </SidebarMenu>
//           </SidebarGroup>
//         </SidebarContent>
//         <SidebarFooter>
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <SidebarMenuButton
//                     size="lg"
//                     className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//                   >
//                     <Avatar className="h-8 w-8 rounded-lg">
//                       <AvatarImage
//                         src={session?.user?.image || ''}
//                         alt={session?.user?.name || ''}
//                       />
//                       <AvatarFallback className="rounded-lg">
//                         {session?.user?.name?.slice(0, 2)?.toUpperCase() ||
//                           'CN'}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="grid flex-1 text-left text-sm leading-tight">
//                       <span className="truncate font-semibold">
//                         {session?.user?.name || ''}
//                       </span>
//                       <span className="truncate text-xs">
//                         {session?.user?.email || ''}
//                       </span>
//                     </div>
//                     <ChevronsUpDown className="ml-auto size-4" />
//                   </SidebarMenuButton>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent
//                   className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
//                   side="bottom"
//                   align="end"
//                   sideOffset={4}
//                 >
//                   <DropdownMenuLabel className="p-0 font-normal">
//                     <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                       <Avatar className="h-8 w-8 rounded-lg">
//                         <AvatarImage
//                           src={session?.user?.image || ''}
//                           alt={session?.user?.name || ''}
//                         />
//                         <AvatarFallback className="rounded-lg">
//                           {session?.user?.name?.slice(0, 2)?.toUpperCase() ||
//                             'CN'}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="grid flex-1 text-left text-sm leading-tight">
//                         <span className="truncate font-semibold">
//                           {session?.user?.name || ''}
//                         </span>
//                         <span className="truncate text-xs">
//                           {' '}
//                           {session?.user?.email || ''}
//                         </span>
//                       </div>
//                     </div>
//                   </DropdownMenuLabel>
//                   <DropdownMenuSeparator />

//                   <DropdownMenuGroup>
//                     <DropdownMenuItem>
//                       <BadgeCheck />
//                       Account
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>
//                       <CreditCard />
//                       Billing
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>
//                       <Bell />
//                       Notifications
//                     </DropdownMenuItem>
//                   </DropdownMenuGroup>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem>
//                     <LogOut />
//                     Log out
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         </SidebarFooter>
//         <SidebarRail />
//       </Sidebar>
// {/* 
//       <SidebarInset className={`transition-all duration-300 w-full  max-w-full
//     ${open ?
//           '  md:!max-w-[76%] lg:!max-w-[81%] xl:!max-w-[81%] 2xl:!max-w-[87%]'
//           :
//           '  md:!max-w-[99%] lg:!max-w-[98%] xl:!max-w-[98%] 2xl:!max-w-[98%]'
//         }
       
//   `}>
//         <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
//           <div className="flex items-center gap-2 px-4">
//             <SidebarTrigger className="-ml-1" />
//             <Separator orientation="vertical" className="mr-2 h-4" />
//             <Breadcrumbs />
//           </div>
//           <div className="hidden w-1/3 items-center gap-2 px-4 md:flex">
//             <SearchInput />
//           </div>
//           <div className="flex items-center gap-2 px-4">
//             <UserNav />
//             <ThemeToggle />
//           </div>
//         </header>
//         {children}
//       </SidebarInset> */}

// <SidebarInset
//   className={`transition-all duration-300 w-full max-w-full
//     ${open
//       ? 'md:!max-w-[76%] lg:!max-w-[81%] xl:!max-w-[81%] 2xl:!max-w-[87%]'
//       : 'md:!max-w-[99%] lg:!max-w-[98%] xl:!max-w-[98%] 2xl:!max-w-[98%]'
//     }
//     flex flex-col h-screen
//   `}
// >
// {/* <SidebarInset
//   className={`transition-all duration-300 w-full max-w-full
// ${open
//       ? `
//         md:!max-w-[76%] 
//         lg:!max-w-[77%] 
//         xl:!max-w-[81%] 
//         2xl:!max-w-[87%] 
//         ipadMini:!max-w-[80%] 
//         ipadAir:!max-w-[70%]
//       `
//       : `
//         md:!max-w-[99%] 
//         lg:!max-w-[98%] 
//         xl:!max-w-[98%] 
//         2xl:!max-w-[98%]
//         ipadMini:!max-w-[97%]
//         ipadAir:!max-w-[95%]
//       `
//     }
//     flex flex-col h-screen
//   `}
// > */}
//   {/* Fixed Header */}
//   {/* <header className={` flex h-16 shrink-0 items-center justify-between gap-2 px-4  transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12
//     ${open ? 'max-w-[100%]': 'max-w-[98.75%]'}
//     `}> */}
//     <header className={`flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12
//           ${
//       paths.includes(pathname)
//         ? open
//           ? 'xl:pr-6'
//           : 'xl:pr-8'
//         : ''
//     }
//       `}>


//     <div className="flex items-center gap-2">
//       <SidebarTrigger className="-ml-1" />
//       <Separator orientation="vertical" className="mr-2 h-4" />
//       <Breadcrumbs />
//     </div>
//     <div className="hidden w-1/3 items-center gap-2 md:flex">
//       <SearchInput />
//     </div>
//     <div className="flex items-center gap-2">
//       <UserNav />
//       <ThemeToggle />
//     </div>
//   </header>

//   {/* Scrollable Content Area */}

//     <div
//   className={`
//     flex-1 h-[calc(100%-4rem)] pb-8 xl:px-0 xl:pl-4
//     ${
//       paths.includes(pathname)
//         ? open
//           ? 'xl:pr-[12px]'
//           : 'xl:pr-6'
//         : ''
//     }
//   `}
// >
//     {children}
//   </div>
// </SidebarInset>



//     </>
//   );
// }









// Awais code 21/05/2025


'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  GalleryVerticalEnd,
  LogOut
} from 'lucide-react';
// import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Breadcrumbs } from '../breadcrumbs';
import { Icons } from '../icons';
import SearchInput from '../search-input';
import ThemeToggle from './ThemeToggle/theme-toggle';
import { UserNav } from './user-nav';
import { NavItem } from '@/types';
import { useClerk, useSession } from '@clerk/nextjs';
import { toast } from 'sonner';

export const company = {
  name: 'Acme Inc',
  logo: GalleryVerticalEnd,
  plan: 'Enterprise'
};

export default function AppSidebar({
  children,
  navItems
}: {
  children: React.ReactNode;
  navItems: NavItem[];
}) {
  const [mounted, setMounted] = React.useState(false);
  // const { data: session } = useSession();
  const pathname = usePathname();
  // Only render after first client-side mount

    const { session } = useSession();
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading skeleton
  }

  return (
    <SidebarProvider>
      <SidebarWithContent navItems={navItems} session={session}>
        {children}
      </SidebarWithContent>
    </SidebarProvider>
  );
}






function SidebarWithContent({
  navItems,
  session,
  children
}: {
  navItems: NavItem[];
  session: any;
  children: React.ReactNode;
}) {
  const { open } = useSidebar(); // ✅ Now inside SidebarProvider
  const pathname = usePathname();

  const { signOut } = useClerk();

     const handleLogout = async() => {
    try {
      await signOut()
      toast.success('Logout Successful')
    } catch (error) {
      toast.error('Unable to Logout!')
    }
   }

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
            <Link href={'/dashboard/overview'}>
          <div className="flex gap-2 py-2 text-sidebar-accent-foreground ">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <company.logo className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{company.name}</span>
              <span className="truncate text-xs">{company.plan}</span>
            </div>
          </div>
            </Link>
        </SidebarHeader>
        <SidebarContent className="overflow-x-hidden">
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon ? Icons[item.icon] : Icons.logo;
                return item?.items && item?.items?.length > 0 ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={pathname === item.url}
                        >
                          {item.icon && <Icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                      src={session?.user?.publicMetadata.image ? String(session?.user?.publicMetadata.image) : session?.user?.imageUrl}
                      alt={session?.user?.publicMetadata.image ? String(session?.user?.publicMetadata.image) : session?.user?.imageUrl}
                      />
                      <AvatarFallback className="rounded-lg">
                        {session?.user?.username?.slice(0, 2)?.toUpperCase() ||
                          'CN'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {session?.user?.username || ''}
                      </span>
                      <span className="truncate text-xs">
                        {session?.user?.email || ''}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                      src={session?.user?.publicMetadata.image ? String(session?.user?.publicMetadata.image) : session?.user?.imageUrl}
                      alt={session?.user?.publicMetadata.image ? String(session?.user?.publicMetadata.image) : session?.user?.imageUrl}
                        />
                        <AvatarFallback className="rounded-lg">
                          {session?.user?.username?.slice(0, 2)?.toUpperCase() ||
                            'CN'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {session?.user?.username || ''}
                        </span>
                        <span className="truncate text-xs">
                          {' '}
                          {session?.user?.email || ''}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className={`transition-all duration-300 w-full  max-w-full
    ${open ?
          '  md:!max-w-[76%] lg:!max-w-[81%] xl:!max-w-[81%] 2xl:!max-w-[87%]'
          :
          '  md:!max-w-[99%] lg:!max-w-[98%] xl:!max-w-[96%] 2xl:!max-w-[98%]'
        }
       
  `}>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumbs />
          </div>
          <div className="hidden w-1/3 items-center gap-2 px-4 md:flex">
            <SearchInput />
          </div>
          <div className="flex items-center gap-2 px-4">
            <UserNav />
            <ThemeToggle />
          </div>
        </header>
        {children}
      </SidebarInset>
    </>
  );
}