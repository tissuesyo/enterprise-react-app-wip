import type { Components, Theme } from '@mui/material/styles';
import { colorTokens, shapeTokens } from '@/shared/theme/tokens';

/**
 * 集中管理 MUI component overrides。
 * 只覆蓋「跨整個系統都要一致」的樣式（例如按鈕不要全大寫），
 * 避免在各個 Feature 裡各自寫 sx 去覆蓋同一件事。
 */
export const componentOverrides: Components<Theme> = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: shapeTokens.borderRadius,
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiSelect: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
  // 全系統的 Dialog 標題色統一由這裡控管，不論是共用 Modal 元件
  // 或未來直接使用原生 MUI Dialog，標題色都會一致。
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        backgroundColor: colorTokens.modalHeaderBackground,
        color: colorTokens.modalHeaderText,
      },
    },
  },
};
