import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)]">
          <div className="h-full p-3 sm:p-4 md:px-4">{children}</div>
        </ScrollArea>
      ) : (
        <div className="h-full p-3 sm:p-4 md:px-4">{children}</div>
      )}
    </>
  );
}
