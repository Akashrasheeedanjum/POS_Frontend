'use client';

import { usePathname } from 'next/navigation';

/**
 * Custom hook to check if current path matches any of the provided paths
 * @param paths Array of paths to match against
 * @param exact If true, will only match exact paths (default: false)
 * @returns boolean indicating if current path matches any of the provided paths
 */
const usePathMatch = (paths: string[], exact: boolean = false): boolean => {
  const pathname = usePathname();

  return paths.some(path => {
    if (exact) {
      return pathname === path;
    }
    return pathname?.startsWith(path) || false;
  });
};

export default usePathMatch;