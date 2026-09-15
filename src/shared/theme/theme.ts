import { createTheme, type Theme } from '@mui/material/styles';
import {
  colorTokens,
  shadowTokens,
  shapeTokens,
  spacingTokens,
  typographyTokens,
} from '@/shared/theme/tokens';
import { componentOverrides } from '@/shared/theme/componentOverrides';

/**
 * 唯一的 MUI Theme 建立點。App 只會 new 一次（見 AppThemeProvider），
 * Feature 頁面不應該再各自 createTheme 或散落 hard-coded 顏色。
 */
export const theme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: colorTokens.primary },
    secondary: { main: colorTokens.secondary },
    error: { main: colorTokens.error },
    warning: { main: colorTokens.warning },
    success: { main: colorTokens.success },
    background: {
      default: colorTokens.background,
      paper: colorTokens.surface,
    },
    text: {
      primary: colorTokens.textPrimary,
      secondary: colorTokens.textSecondary,
    },
    divider: colorTokens.divider,
  },
  typography: {
    fontFamily: typographyTokens.fontFamily,
    fontSize: typographyTokens.fontSizeBase,
  },
  spacing: spacingTokens.unit,
  shape: {
    borderRadius: shapeTokens.borderRadius,
  },
  shadows: Array(25).fill(shadowTokens.card) as Theme['shadows'],
  components: componentOverrides,
});
