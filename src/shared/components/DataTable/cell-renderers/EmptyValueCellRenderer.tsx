import type { ReactNode } from 'react';
import type { CustomCellRendererProps } from 'ag-grid-react';

/** 統一顯示 null/undefined/空字串為 "—"，避免每個 Feature 各自處理空值顯示。 */
export function EmptyValueCellRenderer<TData>(
  params: CustomCellRendererProps<TData, unknown>,
): ReactNode {
  const { value } = params;
  if (value === null || value === undefined || value === '') {
    return <span aria-hidden="true">—</span>;
  }
  return <>{String(value)}</>;
}
