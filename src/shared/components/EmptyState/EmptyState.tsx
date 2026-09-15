import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  /** 例如「Create User」之類的行動按鈕，讓空狀態也能引導使用者下一步。 */
  action?: ReactNode;
  minHeight?: number | string;
}

/** 統一的「無資料」畫面，DataTable 與一般頁面都可以共用。 */
export function EmptyState({
  title = '目前沒有資料',
  description,
  action,
  minHeight = 240,
}: EmptyStateProps): ReactNode {
  return (
    <Box
      role="status"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        minHeight,
        textAlign: 'center',
        color: 'text.secondary',
      }}
    >
      <InboxOutlinedIcon fontSize="large" color="disabled" />
      <Typography variant="subtitle1" color="text.primary">
        {title}
      </Typography>
      {description && <Typography variant="body2">{description}</Typography>}
      {action}
    </Box>
  );
}
