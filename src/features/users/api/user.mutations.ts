import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { createUser } from '@/features/users/api/user.api';
import { userKeys } from '@/features/users/api/user.keys';
import type { CreateUserFormValues } from '@/features/users/api/user.schemas';
import type { User } from '@/features/users/types/user.types';

export function useCreateUserMutation(): UseMutationResult<User, Error, CreateUserFormValues> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // 建立成功後讓 user list 重新 fetch，UserListPage 會自動看到新資料。
      void queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
