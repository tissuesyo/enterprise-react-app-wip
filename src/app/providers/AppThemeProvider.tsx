import type { ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@/shared/theme/theme';

interface AppThemeProviderProps {
  children: ReactNode;
}

/** 集中套用唯一的 MUI Theme，並掛上 CssBaseline 做跨瀏覽器的樣式重置。 */
export function AppThemeProvider({ children }: AppThemeProviderProps): ReactNode {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
