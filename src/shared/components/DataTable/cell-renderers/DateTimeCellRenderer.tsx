import type { ReactNode } from 'react';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { formatDateTime } from '@/shared/utils/datetime';

/** 統一日期時間顯示格式；格式與時區邏輯集中在 shared/utils/datetime，這裡只負責呼叫。 */
export function DateTimeCellRenderer<TData>(
  params: CustomCellRendererProps<TData, string | number>,
): ReactNode {
  const formatted = formatDateTime(params.value);
  if (!formatted) return <span aria-hidden="true">—</span>;
  return <time dateTime={String(params.value)}>{formatted}</time>;
}
