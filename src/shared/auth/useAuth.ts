import { createContext, useContext } from 'react';
import type { AuthContextValue } from '@/shared/auth/auth.types';

/**
 * AuthContext 定義在 shared/auth，實際的 Provider（決定 mock 或 keycloak）
 * 放在 app/providers/AuthProvider.tsx——因為「要用哪種登入模式」是 app 層級的組裝決策，
 * 不是 shared 這種被多處重複使用的底層能力該知道的事。
 */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必須在 <AuthProvider> 內使用');
  }
  return context;
}
