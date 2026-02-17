import { create } from 'zustand';
import type { SortField, SortOrder } from '@/types/user';

interface UIState {
  // Search
  searchInput: string;
  debouncedSearch: string;

  // Pagination
  page: number;
  limit: number;

  // Sorting
  sortField: SortField;
  sortOrder: SortOrder;

  // Modal
  editingUserId: string | null;

  // Actions
  setSearchInput: (val: string) => void;
  setDebouncedSearch: (val: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSorting: (field: SortField) => void;
  openEditModal: (userId: string) => void;
  closeEditModal: () => void;
  resetFilters: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  searchInput: '',
  debouncedSearch: '',
  page: 1,
  limit: 8,
  sortField: 'name',
  sortOrder: 'asc',
  editingUserId: null,

  setSearchInput: (val) => set({ searchInput: val }),
  setDebouncedSearch: (val) => set({ debouncedSearch: val, page: 1 }),

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),

  setSorting: (field) =>
    set(state => ({
      sortField: field,
      sortOrder: state.sortField === field && state.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    })),

  openEditModal: (userId) => set({ editingUserId: userId }),
  closeEditModal: () => set({ editingUserId: null }),

  resetFilters: () =>
    set({
      searchInput: '',
      debouncedSearch: '',
      page: 1,
      sortField: 'name',
      sortOrder: 'asc',
    }),
}));
