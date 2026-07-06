// components/LayoutWrapper.tsx
'use client';

import { scrollablePages } from '@/constants/data';
import usePathMatch from '@/hooks/usePathMatch ';
import { ReactNode } from 'react';

export const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  const isScrollable = usePathMatch(scrollablePages,true);
  
  return (
    <div
      className={`min-h-dvh w-full ${
        isScrollable
          ? 'overflow-y-auto overflow-x-hidden'
          : 'overflow-x-hidden overflow-y-auto lg:overflow-hidden'
      }`}
    >
      {children}
    </div>
  );
};