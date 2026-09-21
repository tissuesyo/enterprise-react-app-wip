/**
 * Design Tokens：把「設計決策」與「MUI 如何套用」分開。
 *
 * 為什麼要有這一層，而不是直接寫在 theme.ts：
 * - 這份專案的目標之一是「逐步翻新舊 AngularJS 系統」。
 *   未來要對齊舊系統的顏色/字級/間距時，只需要改這裡的數值，
 *   不需要理解 MUI createTheme 的 API。
 * - 這些值也可以之後匯出給非 MUI 的地方使用（例如純 CSS、Email 樣板）。
 */
export const colorTokens = {
  primary: '#00647E',
  secondary: '#0F9D8C',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  textPrimary: '#1A2027',
  textSecondary: '#5B6472',
  error: '#D32F2F',
  warning: '#ED6C02',
  success: '#2E7D32',
  divider: '#E3E7EC',
  // 共用 Modal 標題色：獨立於 primary，不隨主色系調整而變動。
  modalHeaderBackground: '#3f51b5',
  modalHeaderText: '#ffffffde',
} as const;

export const typographyTokens = {
  fontFamily: [
    '"Noto Sans TC"',
    '"Inter"',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'sans-serif',
  ].join(','),
  fontSizeBase: 14,
} as const;

export const spacingTokens = {
  // MUI 的 spacing() 會把這個數字當作每一單位的 px 數。
  unit: 8,
} as const;

export const shapeTokens = {
  borderRadius: 8,
} as const;

export const shadowTokens = {
  card: '0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.10)',
} as const;

/**
 * Component density：對應舊 AngularJS Material 系統常見的「緊湊模式」，
 * 讓表格/表單在資訊密度較高的企業系統中，不會有過多留白。
 */
export const densityTokens = {
  compactRowHeight: 36,
  comfortableRowHeight: 44,
} as const;
