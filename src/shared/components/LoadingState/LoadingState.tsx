import type { ReactNode } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export interface LoadingStateProps {
  /** 顯示在轉圈圖示下方的說明文字，預設為「載入中…」。 */
  message?: string;
  /** 讓小區塊（例如卡片內）可以用比較小的高度，而不是佔滿整個畫面。 */
  minHeight?: number | string;
}

/** 統一的載入中畫面，供頁面層與元件層共用（例如 DataTable 的 loading overlay 之外的整頁情境）。 */
export function LoadingState({
  message = '載入中…',
  minHeight = 240,
}: LoadingStateProps): ReactNode {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        minHeight,
      }}
    >
      <CircularProgress size={32} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
