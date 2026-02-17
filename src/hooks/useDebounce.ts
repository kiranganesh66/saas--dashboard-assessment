import { useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';

export function useDebounceSearch(delay = 400) {
  const searchInput = useUIStore(s => s.searchInput);
  const setDebouncedSearch = useUIStore(s => s.setDebouncedSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchInput, delay, setDebouncedSearch]);
}
