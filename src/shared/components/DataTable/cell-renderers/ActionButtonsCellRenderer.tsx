import type { ReactNode } from 'react';
import { Button, Stack, Tooltip } from '@mui/material';
import type { CustomCellRendererProps } from 'ag-grid-react';

export interface CellAction<TData> {
  id: string;
  label: string;
  icon?: ReactNode;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'warning';
  hidden?: boolean | ((row: TData) => boolean);
  disabled?: boolean | ((row: TData) => boolean);
  tooltip?: string | ((row: TData) => string);
  onClick: (row: TData) => void;
}

export interface ActionButtonsCellRendererParams<TData>
  extends CustomCellRendererProps<TData, unknown> {
  actions: CellAction<TData>[];
}

function resolve<TData, TResult>(
  value: TResult | ((row: TData) => TResult) | undefined,
  row: TData,
  fallback: TResult,
): TResult {
  if (value === undefined) return fallback;
  return typeof value === 'function' ? (value as (row: TData) => TResult)(row) : value;
}

/**
 * 顯示一列 Action 按鈕（Edit / Delete 這類操作）。
 *
 * 刻意保持簡單（第一版）：
 * - 不做 More Menu、不做 API loading 協調、不做 confirmation 框架、不做 permission engine。
 *   這些屬於 Feature 的責任——Renderer 只負責「顯示」與「把 row 傳給 onClick」。
 * - 不會直接呼叫 API、不會寫死業務狀態或權限名稱、不會控制任何 Dialog 的開關，
 *   這些都由 Feature 傳入的 `onClick` 處理（見 features/users 的 columnDefs 範例）。
 */
export function ActionButtonsCellRenderer<TData>(
  params: ActionButtonsCellRendererParams<TData>,
): ReactNode {
  const { data, actions } = params;
  if (!data) return null;

  const visibleActions = actions.filter((action) => !resolve(action.hidden, data, false));
  if (visibleActions.length === 0) return null;

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
      {visibleActions.map((action) => {
        const isDisabled = resolve(action.disabled, data, false);
        const tooltipText = resolve(action.tooltip, data, '');

        const button = (
          // 這裡刻意直接用 MUI Button 而非 AppButton：CellAction.color 需要涵蓋
          // 'warning' 這種 AppButton 的 intent（primary/secondary/danger）沒有對應的顏色。
          <Button
            key={action.id}
            size="small"
            variant={action.variant ?? 'text'}
            color={action.color ?? 'primary'}
            startIcon={action.icon}
            disabled={isDisabled}
            onClick={(event) => {
              // 避免點擊按鈕時意外觸發 row click（例如 row 本身也綁了導覽行為）。
              event.stopPropagation();
              action.onClick(data);
            }}
          >
            {action.label}
          </Button>
        );

        return tooltipText ? (
          <Tooltip key={action.id} title={tooltipText}>
            <span>{button}</span>
          </Tooltip>
        ) : (
          button
        );
      })}
    </Stack>
  );
}
