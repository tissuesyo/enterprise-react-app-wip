import type { ReactNode } from 'react';
import { EmptyState } from '@/shared/components/EmptyState';

export interface NoRowsOverlayParams {
  emptyMessage?: string;
}

/** ag-Grid 的 noRowsOverlayComponent；emptyMessage 透過 noRowsOverlayComponentParams 傳入。 */
export function NoRowsOverlay(params: NoRowsOverlayParams): ReactNode {
  return <EmptyState title={params.emptyMessage ?? '目前沒有資料'} minHeight={160} />;
}
