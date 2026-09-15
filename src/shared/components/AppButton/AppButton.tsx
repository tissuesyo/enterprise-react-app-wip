import { forwardRef } from 'react';
import { Button, type ButtonProps } from '@mui/material';

export type AppButtonIntent = 'primary' | 'secondary' | 'danger';

export interface AppButtonProps extends Omit<ButtonProps, 'color'> {
  /** 專案內常用的語意色，內部對應到 MUI 的 color。 */
  intent?: AppButtonIntent;
}

const intentToMuiColor: Record<AppButtonIntent, ButtonProps['color']> = {
  primary: 'primary',
  secondary: 'secondary',
  danger: 'error',
};

/**
 * AppButton 是 MUI Button 的「薄」包裝，只多做一件事：
 * 把專案慣用的語意命名（primary/secondary/danger）對應到 MUI 的 color。
 * 其餘所有 MUI Button 的能力（variant、size、startIcon、loading 狀態的自訂寫法等）
 * 都直接透傳，不重新設計一套 API。
 *
 * 範例：
 *   <AppButton intent="danger" variant="outlined" onClick={handleDelete}>刪除</AppButton>
 */
export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(function AppButton(
  { intent = 'primary', variant = 'contained', ...rest },
  ref,
) {
  return <Button ref={ref} color={intentToMuiColor[intent]} variant={variant} {...rest} />;
});
