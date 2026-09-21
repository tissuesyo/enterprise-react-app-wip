import type { Components, Theme } from '@mui/material/styles';
import { colorTokens, shapeTokens, spacingTokens } from '@/shared/theme/tokens';

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
  // Dialog 外觀統一改成直角，不沿用 shape.borderRadius（那個 token 是給
  // Button/Card 這類元件用的，Modal 邊框是獨立的視覺規則）。
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 0,
      },
    },
  },
  // 全系統的 Dialog 標題色/高度統一由這裡控管，不論是共用 Modal 元件
  // 或未來直接使用原生 MUI Dialog，標題外觀都會一致。
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        backgroundColor: colorTokens.modalHeaderBackground,
        color: colorTokens.modalHeaderText,
        height: 50,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
      },
    },
  },
  // 固定四邊 padding。MUI 內建有一條 `.MuiDialogTitle-root + &` 的 sibling
  // selector，只要 DialogContent 緊跟在 DialogTitle 後面就會把 padding-top
  // 清成 0，且 specificity 比一般的 styleOverrides.root 高，蓋不掉，
  // 所以這裡用 !important 確保上下左右 padding 一致。
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: spacingTokens.unit * 3,
        paddingTop: `${spacingTokens.unit * 3}px !important`,
      },
    },
  },
};
