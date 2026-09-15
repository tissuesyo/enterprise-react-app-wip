import { useMemo, type ReactNode } from 'react';
import { Box } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridOptions } from 'ag-grid-community';
import { agGridTheme, defaultGridOptions, defaultLocaleText } from '@/app/config/agGrid';
import { LoadingOverlay } from './overlays/LoadingOverlay';
import { NoRowsOverlay } from './overlays/NoRowsOverlay';
import type { DataTableProps } from './DataTable.types';

/** 保守的全系統預設欄位設定：可排序、可調整寬度、有 filter，並給合理的 minWidth/flex。 */
const systemDefaultColDef: ColDef = {
  sortable: true,
  resizable: true,
  filter: true,
  minWidth: 120,
  flex: 1,
};

/**
 * DataTable：ag-Grid Enterprise 的薄封裝。
 *
 * 責任邊界（詳見 README「DataTable 與 Feature 的責任界線」）：
 * - DataTable 負責：統一 theme、預設欄位行為、loading/empty overlay、分頁、容器尺寸。
 * - Feature 負責：columnDefs 的實際內容、業務欄位的 cellRenderer/mapping、權限判斷。
 *
 * 設定優先順序：DataTable 明確 props > Feature 傳入的 gridOptions > 全系統預設設定。
 * 這裡用「物件展開的順序」實作合併，比呼叫 ag-Grid 的 mergeGridOptions API 更直觀、也更容易單元測試。
 */
export function DataTable<TData>({
  columnDefs,
  rowData,
  loading = false,
  emptyMessage,
  getRowId,
  height = 480,
  minHeight,
  pagination = false,
  paginationPageSize = 20,
  paginationPageSizeSelector = [20, 50, 100],
  defaultColDef,
  gridOptions,
  onGridReady,
}: DataTableProps<TData>): ReactNode {
  const mergedDefaultColDef = useMemo<ColDef<TData>>(
    () =>
      // ag-Grid 的 ColDef<TData> 型別要求 `field` 對應到 TData 的實際 key，
      // 但這裡合併的三個來源分別是「完全通用」「Feature 傳入的部分設定」「DataTable 明確 props」，
      // TypeScript 無法從物件展開推導出精確的 field 型別，因此用最小範圍的轉型處理，
      // 實際執行時的欄位定義仍然來自 Feature 傳入的 columnDefs，不受這裡的型別轉換影響。
      ({
        ...systemDefaultColDef,
        ...gridOptions?.defaultColDef,
        ...defaultColDef,
      }) as ColDef<TData>,
    [gridOptions?.defaultColDef, defaultColDef],
  );

  const mergedGridOptions = useMemo<GridOptions<TData>>(
    () => ({
      ...defaultGridOptions,
      ...gridOptions,
      defaultColDef: mergedDefaultColDef,
    }),
    [gridOptions, mergedDefaultColDef],
  );

  return (
    <Box sx={{ height, minHeight, width: '100%' }}>
      <AgGridReact<TData>
        theme={agGridTheme}
        localeText={defaultLocaleText}
        gridOptions={mergedGridOptions}
        columnDefs={columnDefs}
        // rowData 在 loading 期間仍傳空陣列，並搭配 suppressNoRowsOverlay
        // 避免 ag-Grid 在資料還沒回來前，先短暫閃現「無資料」畫面。
        rowData={rowData ?? []}
        loading={loading}
        suppressNoRowsOverlay={loading}
        getRowId={getRowId}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
        loadingOverlayComponent={LoadingOverlay}
        noRowsOverlayComponent={NoRowsOverlay}
        noRowsOverlayComponentParams={{ emptyMessage }}
        onGridReady={onGridReady}
      />
    </Box>
  );
}
