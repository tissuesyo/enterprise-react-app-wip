import { apiClient } from '@/shared/api/apiClient';
import type { User } from '@/features/users/types/user.types';
import type { CreateUserFormValues } from '@/features/users/api/user.schemas';

/**
 * Feature 的 API 呼叫層：只有這裡可以直接使用 apiClient / 知道實際的 URL 路徑。
 * React 元件與 Query/Mutation hook 都不會直接碰 apiClient。
 */
export async function fetchUsers(signal?: AbortSignal): Promise<User[]> {
  const response = await apiClient.get<User[]>('/users', { signal });
  return response.data;
}

export async function createUser(input: CreateUserFormValues): Promise<User> {
  const response = await apiClient.post<User>('/users', input);
  return response.data;
}
