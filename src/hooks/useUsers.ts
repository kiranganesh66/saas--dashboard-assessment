import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, updateUser } from '@/lib/mockApi';
import { useUIStore } from '@/store/uiStore';
import type { UpdateUserPayload, User } from '@/types/user';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: object) => [...userKeys.lists(), params] as const,
};

export function useUsers() {
  const page = useUIStore(s => s.page);
  const limit = useUIStore(s => s.limit);
  const search = useUIStore(s => s.debouncedSearch);
  const sortField = useUIStore(s => s.sortField);
  const sortOrder = useUIStore(s => s.sortOrder);

  const params = { page, limit, search, sortField, sortOrder };

  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => fetchUsers(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30, // 30s cache
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUser(id, payload),

    // Optimistic update
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });

      const previousData = queryClient.getQueriesData({ queryKey: userKeys.lists() });

      queryClient.setQueriesData(
        { queryKey: userKeys.lists() },
        (old: { users: User[]; total: number; page: number; limit: number; totalPages: number } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            users: old.users.map((u: User) =>
              u.id === id ? { ...u, ...payload } : u
            ),
          };
        }
      );

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
