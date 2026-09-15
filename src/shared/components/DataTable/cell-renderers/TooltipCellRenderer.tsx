import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Tooltip, Typography } from '@mui/material';
import type { CustomCellRendererProps } from 'ag-grid-react';

export interface TooltipCellRendererParams<TData> extends CustomCellRendererProps<TData, string> {
  /** 自訂 Tooltip 顯示內容，預設直接使用 value。 */
  tooltipContent?: (row: TData) => string;
  /** 顯示的最大行數，超過就截斷，預設 1 行（single line ellipsis）。 */
  maxLines?: number;
}

/**
 * 長文字截斷 + 只有真的 overflow 時才顯示 Tooltip。
 * 用 ResizeObserver 判斷實際渲染高度/寬度是否超過容器，避免「文字明明沒有被截斷，滑鼠移過去卻跳出 Tooltip」的體驗問題。
 */
export function TooltipCellRenderer<TData>(
  params: TooltipCellRendererParams<TData>,
): ReactNode {
  const { value, data, tooltipContent, maxLines = 1 } = params;
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    setIsOverflowing(el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth);
  }, [value]);

  if (value === null || value === undefined || value === '') {
    return <span aria-hidden="true">—</span>;
  }

  const content = data && tooltipContent ? tooltipContent(data) : value;

  const text = (
    <Typography
      ref={textRef}
      variant="body2"
      component="span"
      sx={{
        display: '-webkit-box',
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}
    >
      {value}
    </Typography>
  );

  return isOverflowing ? <Tooltip title={content}>{text}</Tooltip> : text;
}
