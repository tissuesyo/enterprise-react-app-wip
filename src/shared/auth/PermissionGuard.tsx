import type { ReactNode } from 'react';
import { useAuth } from '@/shared/auth/useAuth';

export interface PermissionGuardProps {
  /** 允許顯示 children 的角色清單；使用者只要符合其中一個就會通過。 */
  anyOfRoles: string[];
  children: ReactNode;
  /** 權限不足時顯示的內容，預設不渲染任何東西。 */
  fallback?: ReactNode;
}

/**
 * 純粹依「角色」決定 UI 是否顯示的共用元件。
 * 注意：這只是前端 UX 層的顯示/隱藏，不是安全邊界——
 * 真正的權限檢查一定要在後端 API 再做一次。
 *
 * 屬於 shared 的原因：「依角色顯示/隱藏內容」是跨所有 Feature 的通用能力，
 * 但「哪個角色可以刪除使用者」這種具體業務規則（例如 canDeleteUser）
 * 要留在 Feature 內，不要寫進這個元件。
 */
export function PermissionGuard({
  anyOfRoles,
  children,
  fallback = null,
}: PermissionGuardProps): ReactNode {
  const { hasRole } = useAuth();
  const allowed = anyOfRoles.some((role) => hasRole(role));
  return allowed ? children : fallback;
}
