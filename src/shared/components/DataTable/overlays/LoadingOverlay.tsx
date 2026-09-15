import type { ReactNode } from 'react';
import { LoadingState } from '@/shared/components/LoadingState';

/** ag-Grid 的 loadingOverlayComponent：不接受自訂 params，直接重用共用的 LoadingState。 */
export function LoadingOverlay(): ReactNode {
  return <LoadingState message="載入中…" minHeight={160} />;
}
