import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box } from '@mui/material';
import { ErrorState } from '@/shared/components/ErrorState';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | undefined;
}

/**
 * Application 層級的 Error Boundary，捕捉 Provider 初始化或任何未被
 * RouteErrorBoundary 攔到的 render 錯誤（例如 Router 都還沒建立好之前的錯誤）。
 * Error Boundary 目前只能用 class component 實作，React 還沒有對應的 hook。
 */
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: undefined };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[AppErrorBoundary] Uncaught error', error, errorInfo);
  }

  override render(): ReactNode {
    if (this.state.error) {
      return (
        <Box
          sx={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ErrorState
            title="應用程式發生錯誤"
            description="請重新整理頁面；如果問題持續發生，請聯絡系統管理員。"
          />
        </Box>
      );
    }
    return this.props.children;
  }
}
