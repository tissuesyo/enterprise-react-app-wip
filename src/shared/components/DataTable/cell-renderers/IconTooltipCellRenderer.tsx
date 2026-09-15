import type { ReactNode } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import type { CustomCellRendererProps } from 'ag-grid-react';

export interface IconTooltipCellRendererParams<TData> extends CustomCellRendererProps<TData, unknown> {
  icon: SvgIconComponent;
  tooltip: string | ((row: TData) => string);
  ariaLabel: string | ((row: TData) => string);
  onIconClick?: (row: TData) => void;
  disabled?: boolean | ((row: TData) => boolean);
}

function resolve<TData, TResult>(
  value: TResult | ((row: TData) => TResult),
  row: TData,
): TResult {
  return typeof value === 'function' ? (value as (row: TData) => TResult)(row) : value;
}

/**
 * 顯示一個帶 Tooltip 的圖示。
 * 只有在提供 `onIconClick` 時才會渲染成可點擊的 IconButton；
 * 沒有提供的話就只是單純的顯示用圖示，不偽裝成按鈕（避免鍵盤使用者以為可以互動卻沒反應）。
 */
export function IconTooltipCellRenderer<TData>(
  params: IconTooltipCellRendererParams<TData>,
): ReactNode {
  const { data, icon: Icon, tooltip, ariaLabel, onIconClick, disabled } = params;
  if (!data) return null;

  const tooltipText = resolve(tooltip, data);
  const label = resolve(ariaLabel, data);
  const isDisabled = resolve(disabled ?? false, data);

  if (!onIconClick) {
    return (
      <Tooltip title={tooltipText}>
        <Icon fontSize="small" aria-label={label} color={isDisabled ? 'disabled' : 'inherit'} />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={tooltipText}>
      <span>
        <IconButton
          size="small"
          aria-label={label}
          disabled={isDisabled}
          onClick={(event) => {
            // 避免點擊圖示時意外觸發 ag-Grid 的 row click / cell 選取行為。
            event.stopPropagation();
            onIconClick(data);
          }}
        >
          <Icon fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
  );
}
