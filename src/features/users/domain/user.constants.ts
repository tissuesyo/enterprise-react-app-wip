import type { User, UserRole } from '@/features/users/types/user.types';

/** Role 的預先定義清單，同時餵給表單的 FormSelect 與（未來）欄位顯示文字。 */
export const USER_ROLE_OPTIONS: ReadonlyArray<{ value: UserRole; label: string }> = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

/** Status 對應的 Tag 顏色，這是 User Feature 自己的業務 mapping，不下放到 Shared TagCellRenderer。 */
export const USER_STATUS_TAG_COLOR: Record<User['status'], 'success' | 'default'> = {
  ACTIVE: 'success',
  INACTIVE: 'default',
};

/** 業務規則範例：只有 admin 以外、且帳號為 ACTIVE 的使用者才允許刪除。 */
export function canDeleteUser(user: User): boolean {
  return user.status === 'ACTIVE' && user.role !== 'admin';
}
