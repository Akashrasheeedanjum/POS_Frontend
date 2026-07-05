'use client';
import OverViewPage from './_components/overview';
import { useBeforeUnloadLogout } from '@/hooks/useBeforeUnloadLogout';

// export const metadata = {
//   title: 'Dashboard : Overview'
// };

export default function Page() {

   useBeforeUnloadLogout();
  return <OverViewPage />;
}
