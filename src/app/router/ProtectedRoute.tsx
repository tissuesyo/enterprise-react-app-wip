import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { LoadingState } from '@/shared/components/LoadingState';
import { useAuth } from '@/shared/auth/useAuth';

/**
 * 包在需要登入才能看的路由外層。
 * Keycloak 模式下，未登入時 `initKeycloak` 已經是 `onLoad: 'login-required'`，
 * 瀏覽器通常已經在導向登入頁的路上；這裡的 isAuthenticated 檢查是最後一道保險，
 * 避免短暫的中間狀態把還沒授權的畫面渲染出來。
 */
export function ProtectedRoute(): ReactNode {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="驗證登入狀態中…" minHeight="100vh" />;
  }

  if (!isAuthenticated) {
    return <LoadingState message="正在導向登入頁…" minHeight="100vh" />;
  }

  return <Outlet />;
}
