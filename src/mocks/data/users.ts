import type { User } from '@/features/users/types/user.types';

/**
 * Mock 資料本身跟 handler 分開放，方便 Vitest 與 Playwright 都可以 import 同一份初始資料做斷言，
 * 不需要各自重新宣告一份。
 */
export const initialMockUsers: User[] = [
  {
    id: 'usr_1',
    name: 'Alice Chen',
    email: 'alice.chen@example.com',
    role: 'admin',
    age: 34,
    status: 'ACTIVE',
    createdAt: '2025-01-10T02:00:00.000Z',
  },
  {
    id: 'usr_2',
    name: 'Ben Wu',
    email: 'ben.wu@example.com',
    role: 'editor',
    age: 28,
    status: 'ACTIVE',
    createdAt: '2025-02-14T02:00:00.000Z',
  },
  {
    id: 'usr_3',
    name: 'Cindy Lin',
    email: 'cindy.lin@example.com',
    role: 'viewer',
    age: 45,
    status: 'INACTIVE',
    createdAt: '2025-03-20T02:00:00.000Z',
  },
];
