import type { ReactNode } from 'react';
import { AppErrorBoundary } from '@/app/providers/AppErrorBoundary';
import { AppThemeProvider } from '@/app/providers/AppThemeProvider';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { AgGridProvider } from '@/app/providers/AgGridProvider';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * 唯一的 Provider 組裝點。main.tsx 只需要 `<AppProviders><RouterProvider .../></AppProviders>`，
 * 不應該在任何頁面裡再重複包一次這些 Provider。
 *
 * 順序說明：
 * 1. AppErrorBoundary 最外層，確保連 Theme/Query 初始化失敗都攔得住。
 * 2. AppThemeProvider 提前，讓 ErrorBoundary 顯示的錯誤畫面也能套用到正確的 MUI 樣式。
 * 3. QueryProvider / AuthProvider 互不依賴，可以任意順序；AgGridProvider 放最內層，
 *    因為它只是確保 module 註冊在任何 DataTable render 之前完成，不提供 Context。
 */
export function AppProviders({ children }: AppProvidersProps): ReactNode {
  return (
    <AppErrorBoundary>
      <AppThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <AgGridProvider>{children}</AgGridProvider>
          </AuthProvider>
        </QueryProvider>
      </AppThemeProvider>
    </AppErrorBoundary>
  );
}
