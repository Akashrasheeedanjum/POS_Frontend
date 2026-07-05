// components/LayoutWrapper.tsx
'use client';

import { scrollablePages } from '@/constants/data';
import usePathMatch from '@/hooks/usePathMatch ';
import { ReactNode } from 'react';

export const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  const isScrollable = usePathMatch(scrollablePages,true);
  
  return (
    <body className={`${isScrollable?"overflow-y-auto overflow-x-hidden":"overflow-hidden"}`}>
      {children}
    </body>
  );
};