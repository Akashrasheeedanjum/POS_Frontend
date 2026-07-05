'use client';
import { useEffect } from 'react';
import { useClerk } from '@clerk/nextjs';

export const useBeforeUnloadLogout = () => {
  const { signOut } = useClerk();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // ✅ Use a non-empty string (some browsers require this)
      const message = 'Are you sure you want to leave? You will be logged out.';
      event.preventDefault();
      event.returnValue = message;
      return message; // Needed for some browsers
    };

    const handleUnload = async () => {
      try {
        await signOut();
      } catch (err) {
        console.error('Error logging out before unload:', err);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [signOut]);
};
