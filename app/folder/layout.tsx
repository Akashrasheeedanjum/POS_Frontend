import AppSidebar from '@/components/layout/app-sidebar';
import { folderNavItems, settingNavItems } from '@/constants/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <body>
      <AppSidebar navItems={folderNavItems}>{children}</AppSidebar>
    </body>
  );
}
