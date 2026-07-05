import AppSidebar from '@/components/layout/app-sidebar';
import { navItems } from '@/constants/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
  description: 'Customers Operations'
};

export default function CustomersLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppSidebar navItems={navItems}>{children}</AppSidebar>
    </>
  );
}
