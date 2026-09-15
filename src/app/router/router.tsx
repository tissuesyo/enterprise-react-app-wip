import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/shared/layouts/AppLayout';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { RouteErrorBoundary } from '@/app/router/RouteErrorBoundary';
import { UserListPage, CreateUserPage, UserDetailPage } from '@/features/users';

/**
 * 集中定義的路由表。
 * 新增頁面時：在對應 Feature 底下建立 page 元件 → 在 Feature 的 index.ts 匯出 →
 * 在這裡加一行 route。詳見 README「如何新增頁面與 Route」。
 */
export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <UserListPage /> },
          { path: '/users', element: <UserListPage /> },
          { path: '/users/new', element: <CreateUserPage /> },
          { path: '/users/:id', element: <UserDetailPage /> },
        ],
      },
    ],
  },
]);
