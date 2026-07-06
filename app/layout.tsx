// import { auth } from '@/auth';
import Providers from '@/components/layout/providers';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata, Viewport } from 'next';
// import { Lato } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { ClerkProvider } from "@clerk/nextjs";
import ThemeProvider from '@/components/layout/ThemeToggle/theme-provider';

export const metadata: Metadata = {
  title: 'Lahore POS',
  description: 'Point of sale for scrap, production, and retail sales'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
};

// const lato = Lato({
//   subsets: ['latin'],
//   weight: ['400', '700', '900'],
//   display: 'swap'
// });

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();

  return (
    <ClerkProvider>
    <html
      lang="en"
      // className={`${lato.className}`}
      suppressHydrationWarning={true}
    >
        <body className="min-h-dvh overflow-x-hidden antialiased">
       <ThemeProvider attribute="class" defaultTheme="system" enableSystem> 
      <LayoutWrapper>
        <NextTopLoader showSpinner={false} />
        {/* <Providers session={session}> */}
          <Toaster />
          {children}
        {/* </Providers> */}
      </LayoutWrapper>
       </ThemeProvider>
       </body>
    </html>
    </ClerkProvider>
  );
}
