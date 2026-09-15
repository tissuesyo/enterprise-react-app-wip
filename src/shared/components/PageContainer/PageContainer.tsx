import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';

export interface PageContainerProps {
  /** 頁面標題，顯示在內容上方；不需要的話可以省略。 */
  title?: string;
  /** 標題右側的操作區，例如「Create User」按鈕。 */
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * 提供統一的頁面外框（留白、標題排版），
 * 讓所有 Feature 頁面看起來一致，不需要每個頁面都自己重寫 padding/標題樣式。
 * 內部直接使用 MUI 的 Box/Stack/Typography，不需要再包一層抽象。
 */
export function PageContainer({ title, actions, children }: PageContainerProps): ReactNode {
  return (
    <Box component="main" sx={{ p: { xs: 2, md: 3 } }}>
      {(title ?? actions) && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          {title && (
            <Typography variant="h5" component="h1" fontWeight={600}>
              {title}
            </Typography>
          )}
          {actions}
        </Stack>
      )}
      {children}
    </Box>
  );
}
