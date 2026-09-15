import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchUsers } from '@/features/users/api/user.api';
import { userKeys } from '@/features/users/api/user.keys';
import type { User } from '@/features/users/types/user.types';

export function useUsersQuery(): UseQueryResult<User[]> {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: ({ signal }) => fetchUsers(signal),
  });
}
