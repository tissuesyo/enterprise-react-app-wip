import type { ReactNode } from 'react';
import { useRouteError } from 'react-router-dom';
import { Box } from '@mui/material';
import { ErrorState } from '@/shared/components/ErrorState';

/** react-router 的 errorElement：路由層級（載入頁面失敗、render 出錯）都會落到這裡。 */
export function RouteErrorBoundary(): ReactNode {
  const error = useRouteError();
  const description = error instanceof Error ? error.message : '這個頁面暫時無法顯示。';

  return (
    <Box sx={{ p: 4 }}>
      <ErrorState title="頁面發生錯誤" description={description} minHeight="60vh" />
    </Box>
  );
}
