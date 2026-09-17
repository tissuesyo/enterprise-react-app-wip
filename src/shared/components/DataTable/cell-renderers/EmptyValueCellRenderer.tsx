import type { ReactNode } from 'react';
import type { CustomCellRendererProps } from 'ag-grid-react';

/**
 * 安全地把任意值轉成字串顯示。
 * `value` 的型別是 `unknown`（欄位實際內容由 Feature 決定），直接呼叫 `String()`
 * 在值是一般物件（沒有自訂 toString）時會顯示沒有意義的 "[object Object]"，
 * 所以這裡只信任基本型別，物件一律用 JSON.stringify 呈現，避免誤導使用者。
 */
function stringifyValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value instanceof Date) return value.toISOString();
  try {
    return JSON.stringify(value) ?? '';
  } catch {
    return '';
  }
}

/** 統一顯示 null/undefined/空字串為 "—"，避免每個 Feature 各自處理空值顯示。 */
export function EmptyValueCellRenderer<TData>(
  params: CustomCellRendererProps<TData, unknown>,
): ReactNode {
  const { value } = params;
  if (value === null || value === undefined || value === '') {
    return <span aria-hidden="true">—</span>;
  }
  return <>{stringifyValue(value)}</>;
}
