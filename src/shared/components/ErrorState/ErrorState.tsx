import type { ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export interface ErrorStateProps {
  title?: string;
  /** 通常帶入 ApiError.message，已經是「使用者看得懂」的訊息。 */
  description?: string;
  /** 提供「重試」按鈕時的 callback，例如 React Query 的 refetch。 */
  onRetry?: () => void;
  minHeight?: number | string;
}

/** 統一的錯誤畫面。刻意不在這裡處理「怎麼分類錯誤」，那是呼叫端（Feature）的責任。 */
export function ErrorState({
  title = '發生錯誤',
  description = '讀取資料時發生問題，請稍後再試一次。',
  onRetry,
  minHeight = 240,
}: ErrorStateProps): ReactNode {
  return (
    <Box
      role="alert"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        minHeight,
        textAlign: 'center',
      }}
    >
      <ErrorOutlineIcon fontSize="large" color="error" />
      <Typography variant="subtitle1">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      {onRetry && (
        <Button variant="outlined" size="small" onClick={onRetry}>
          重試
        </Button>
      )}
    </Box>
  );
}
