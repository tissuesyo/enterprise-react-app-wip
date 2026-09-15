import type {
  ColDef,
  GetRowIdFunc,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';

/**
 * DataTable 的公開 props。實際型別以安裝版本的 ag-Grid 官方 TypeScript API 為準——
 * 這裡不自行複製/重新定義 ColDef、GridOptions 等第三方型別，而是直接重用它們的 generic。
 */
export interface DataTableProps<TData> {
  columnDefs: ColDef<TData>[];
  rowData: TData[] | undefined;
  loading?: boolean;
  emptyMessage?: string;
  getRowId?: GetRowIdFunc<TData>;

  height?: number | string;
  minHeight?: number | string;

  pagination?: boolean;
  paginationPageSize?: number;
  paginationPageSizeSelector?: number[] | false;

  defaultColDef?: ColDef<TData>;
  /**
   * 進階設定入口：Set Filter、Row Grouping、Side Bar、Master Detail 等
   * ag-Grid Enterprise 功能一律透過這裡傳入原生 gridOptions，
   * DataTable 不會替每個 ag-Grid 功能重新設計一個自訂 prop。
   *
   * 合併優先順序（見 DataTable.tsx 內的 mergeGridOptions）：
   *   DataTable 明確 props > gridOptions > 全系統預設設定
   */
  gridOptions?: GridOptions<TData>;

  onGridReady?: (event: GridReadyEvent<TData>) => void;
}
