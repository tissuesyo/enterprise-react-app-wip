import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type GridOptions,
} from 'ag-grid-community';
import { AllEnterpriseModule, LicenseManager } from 'ag-grid-enterprise';
import { env } from '@/app/config/env';
import { colorTokens, shapeTokens } from '@/shared/theme/tokens';

/**
 * ag-Grid module 註冊與 Enterprise License 設定，集中在這一個檔案。
 *
 * MVP 決策：目前註冊 `AllCommunityModule` + `AllEnterpriseModule`（全部功能），
 * 原因是專案初期功能還在快速變動，逐一挑選 module 的維護成本 > 減少的 bundle size。
 *
 * 未來優化方向（見 README「ag-Grid」章節）：
 * 改成只註冊實際用到的 module，例如：
 *   ClientSideRowModelModule, ColumnMenuModule, ExcelExportModule, SetFilterModule ...
 * 可以透過 build 後的 bundle analyzer 找出實際用到哪些功能後再瘦身。
 */
let initialized = false;

export function initAgGrid(): void {
  // React Strict Mode 在開發環境會刻意 render 兩次；
  // 這裡加上 guard，避免重複註冊 module 或重複設定 License 印出多餘的警告。
  if (initialized) return;
  initialized = true;

  ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

  // 沒有設定 License Key 時，刻意「不呼叫」setLicenseKey，
  // ag-Grid Enterprise 官方行為是：開發環境仍可正常啟動，
  // 只會在畫面角落顯示 evaluation 浮水印，不會 throw 或讓 app crash。
  if (env.agGridLicenseKey) {
    LicenseManager.setLicenseKey(env.agGridLicenseKey);
  }
}

/**
 * 全系統預設 GridOptions（例如 locale text）。
 * 注意：這是「全系統預設」，優先順序低於 Feature 傳入的 gridOptions，
 * 也低於 DataTable 明確 props。實際合併邏輯見 shared/components/DataTable。
 */
export const defaultGridOptions: GridOptions = {
  suppressCellFocus: false,
  rowHeight: 44,
  headerHeight: 44,
};

/**
 * 集中定義的 ag-Grid 主題（使用 ag-Grid v33+ 的 Theming API），
 * 顏色/圓角直接沿用 shared/theme/tokens，避免表格跟系統其他地方的視覺不一致，
 * 也方便未來對齊舊 AngularJS Material 系統時只需要改一個地方。
 */
export const agGridTheme = themeQuartz.withParams({
  accentColor: colorTokens.primary,
  borderRadius: shapeTokens.borderRadius,
  fontFamily: 'inherit',
  headerFontWeight: 600,
});

/** 常用的繁體中文 locale text，只覆蓋 MVP 實際用到的字串，其餘沿用 ag-Grid 官方預設（英文）。 */
export const defaultLocaleText: Record<string, string> = {
  loadingOoo: '載入中…',
  noRowsToShow: '目前沒有資料',
  page: '頁',
  more: '更多',
  to: '到',
  of: '共',
  next: '下一頁',
  previous: '上一頁',
  first: '第一頁',
  last: '最後一頁',
};
