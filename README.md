# Enterprise React App

企業級 React 前端骨架，目標是提供給**不熟悉 React 的團隊**快速上手，並作為逐步翻新舊
AngularJS 系統的新前端基礎。

## 1. 專案目的

- 提供一個可以直接安裝、啟動、測試的 React 19 + TypeScript 專案骨架。
- 用清楚、一致的 Feature-based 架構，降低多人長期維護的心智負擔。
- 用「使用者管理」（`/users`、`/users/new`）作為完整可運行的範例，示範每一層該放什麼。

## 2. 技術清單

| 分類 | 套件 | 用途 |
| --- | --- | --- |
| 核心 | React 19 / TypeScript (strict) / Vite / React Router 7 | SPA 應用程式骨架 |
| Server State | TanStack Query | API 資料的 fetch / cache / mutation |
| Client State | Zustand（已安裝，目前 MVP 未使用，見第 17 節） | 跨頁面/跨元件的 UI 狀態 |
| 表單 | React Hook Form / Zod / @hookform/resolvers | 表單狀態與驗證 |
| UI | MUI / MUI Icons / ag-Grid React（Enterprise） | 元件庫與表格 |
| 登入 | keycloak-js | Keycloak 登入（可切換 mock 模式） |
| API | Axios | 統一的 HTTP client |
| Mock / 測試 | MSW / Vitest / Testing Library / Playwright | 本機 mock API、單元/元件測試、E2E |
| 工程品質 | ESLint (Flat Config) / typescript-eslint / eslint-plugin-react-hooks / eslint-plugin-jsx-a11y / Prettier / Husky / lint-staged | Lint、格式化、Commit 檢查 |

## 3. 前置需求

- Node.js LTS（見 `.nvmrc`，目前為 Node 22；建議搭配 `nvm use`）
- npm（隨 Node 附帶）

## 4. 安裝方式

```bash
npm install
cp .env.example .env   # 預設值已經可以直接跑（mock auth + MSW），不需要修改
```

## 5. 啟動方式

```bash
npm run dev
```

預設在 <http://localhost:5173>，`VITE_AUTH_MODE=mock` + `VITE_ENABLE_MSW=true`，
不需要任何後端或 Keycloak 就能完整操作使用者管理範例。

## 6. Environment Variables

集中定義在 `src/app/config/env.ts`（型別安全、缺值會丟出清楚的錯誤訊息，而不是
讓程式在不知名的地方噴出難懂的例外）。

| 變數 | 說明 |
| --- | --- |
| `VITE_API_BASE_URL` | API base URL，預設 `/api` |
| `VITE_ENABLE_MSW` | 是否啟動 MSW（只在 `DEV` 模式生效） |
| `VITE_AUTH_MODE` | `mock` 或 `keycloak` |
| `VITE_KEYCLOAK_URL` / `VITE_KEYCLOAK_REALM` / `VITE_KEYCLOAK_CLIENT_ID` | 只有 `VITE_AUTH_MODE=keycloak` 時才是必填 |
| `VITE_AG_GRID_LICENSE_KEY` | 留空時 ag-Grid Enterprise 仍可啟動，只會顯示官方 evaluation 浮水印 |

業務元件一律透過 `import { env } from '@/app/config/env'` 取用，不直接讀
`import.meta.env`。

## 7. Mock Auth 與 Keycloak Auth 切換

在 `.env` 設定 `VITE_AUTH_MODE`：

- `mock`（預設）：`src/app/providers/AuthProvider.tsx` 會直接注入一個假使用者
  （見 `MOCK_USER`），本機開發、Vitest、Playwright 都用這個模式，不依賴任何後端。
- `keycloak`：改用 `keycloak-js` 真實登入，需要同時填好
  `VITE_KEYCLOAK_URL` / `VITE_KEYCLOAK_REALM` / `VITE_KEYCLOAK_CLIENT_ID`。
  未登入時會自動導向登入頁（`onLoad: 'login-required'`）；Token 只保存在記憶體，
  不寫進 `localStorage`；到期前會自動 refresh，失敗則導回登入頁。

業務元件一律透過 `useAuth()`（`src/shared/auth/useAuth.ts`）取用登入狀態，
不會直接操作 Keycloak instance。

## 8. MSW 啟用方式

`VITE_ENABLE_MSW=true` 且 `import.meta.env.DEV` 為真時才會啟動（見 `src/main.tsx`）。
Handler 依 Feature 分檔在 `src/mocks/handlers/`，由 `src/mocks/handlers.ts` 組裝。
同一套 handler 也提供給 Vitest（`src/mocks/server.ts` + `src/test/setup.ts`）與
Playwright（透過 `npm run dev:e2e` 啟動的瀏覽器 worker）使用。

## 9. ag-Grid Enterprise License 設定

集中在 `src/app/config/agGrid.ts`：

- `initAgGrid()` 負責 module registration（`AllCommunityModule` + `AllEnterpriseModule`）
  與呼叫 `LicenseManager.setLicenseKey()`。由 `src/app/providers/AgGridProvider.tsx`
  在第一個 DataTable render 之前呼叫一次（用 `useState` initializer + 內部旗標，避免
  React Strict Mode 下重複註冊）。
- 沒有設定 `VITE_AG_GRID_LICENSE_KEY` 時，刻意不呼叫 `setLicenseKey`——開發環境仍可
  正常啟動，只會顯示官方 evaluation 浮水印，不會導致 crash。
- **MVP 決策**：目前註冊全部 Community + Enterprise module 以簡化設定。未來若要降低
  bundle size，可以改成只註冊實際用到的 module（例如
  `ClientSideRowModelModule`、`ColumnMenuModule`、`ExcelExportModule`、
  `SetFilterModule`…），建議先用 bundle analyzer 確認實際用到哪些功能再瘦身。

## 10. Lint / Typecheck / Test / Build / E2E

```bash
npm run typecheck     # tsc -b --noEmit
npm run lint           # ESLint
npm run lint:fix
npm run format:check   # Prettier 檢查
npm run format
npm run test:run       # Vitest（單次執行）
npm run test           # Vitest watch 模式
npm run test:coverage
npm run build           # tsc -b && vite build
npm run preview
npm run e2e             # Playwright（會自動用 `npm run dev:e2e` 啟動 dev server）
```

## 11. 目錄架構

```text
src/
├── app/            # 應用程式組裝層：Provider、Router、集中式 config
├── features/       # 業務功能，每個 Feature 擁有自己的 pages/components/api/types/domain
├── shared/         # 跨 Feature 共用、且不含特定業務概念的能力
├── mocks/          # MSW handlers 與 mock data
├── test/           # Vitest 共用的 setup 與 renderWithProviders
├── main.tsx
└── vite-env.d.ts
e2e/                # Playwright 測試
```

## 12. 各層責任

| 層 | 責任 |
| --- | --- |
| `app` | 組裝 Provider、定義路由、集中式 config（env / queryClient / agGrid）。 |
| `features/<name>` | 該業務功能的頁面、元件、API、Query/Mutation、Schema、型別、商業規則。 |
| `shared` | 真正不含特定業務概念、且被多個 Feature 使用的能力（UI 元件、API client、auth、theme）。 |
| `mocks` | 開發/測試用的假後端。 |

## 13. Feature 依賴規則

```text
app      → 可以依賴 features、shared
features → 可以依賴 shared，不可以依賴其他 Feature 的內部檔案
shared   → 不可以依賴 features
```

Feature 需要對外公開的內容（通常是 pages）一律透過該 Feature 的 `index.ts` 匯出，
例如 `src/features/users/index.ts`。`app/router/router.tsx` 只從這個 barrel import，
不會直接 import `features/users/pages/UserListPage` 這種內部路徑。

## 14. 如何新增 Feature

1. 建立 `src/features/<feature-name>/`，依需要建立 `pages/ components/ api/ types/ domain/`
   子目錄（不要預先建立空的子目錄，等真的有內容再建立）。
2. 業務邏輯、API 呼叫、型別都放在這個資料夾內；只有真正跨 Feature 共用、且不含特定
   業務概念的東西才拉到 `shared`。
3. 在 `src/features/<feature-name>/index.ts` 匯出外部（主要是 `app/router`）需要用到的
   pages。

## 15. 如何新增頁面與 Route

1. 在 Feature 的 `pages/` 建立頁面元件（參考 `UserListPage.tsx`）。
2. 在該 Feature 的 `index.ts` 匯出這個頁面元件。
3. 在 `src/app/router/router.tsx` 的 `children` 陣列加一筆路由設定。
4. 需要登入才能看的頁面，確保路由被包在 `ProtectedRoute` 底下（目前所有業務路由都是）。

## 16. 如何新增表單欄位

1. 在該 Feature 的 `api/<feature>.schemas.ts` 用 Zod 定義欄位與驗證規則，
   並用 `z.infer<typeof schema>` 推導出表單值的型別——不要額外手寫一份重複的 TS type。
2. 在對應的 `components/<Feature>Form.tsx` 加上欄位：
   - 一般文字輸入：`<FormTextField name="..." control={control} label="..." />`
   - 下拉選單：`<FormSelect name="..." control={control} label="..." options={...} />`
   - 非標準欄位（Upload、Checkbox Group…）：用 `<FormField>` 包裝自訂的輸入元件。

## 17. 如何新增 API、Query、Mutation

1. `api/<feature>.api.ts`：實際呼叫 `apiClient`（Axios）的函式，這是整個 Feature 唯一
   可以直接使用 apiClient 的地方。
2. `api/<feature>.keys.ts`：集中管理 Query Key（factory pattern）。
3. `api/<feature>.queries.ts`：包裝 `useQuery`。
4. `api/<feature>.mutations.ts`：包裝 `useMutation`，成功後視需要
   `queryClient.invalidateQueries(...)`。

React 元件一律透過這些 hook 取得資料，不直接呼叫 `fetch`/`axios`。

## 18. 如何新增 MSW Handler

1. 在 `src/mocks/handlers/<feature>.handlers.ts` 新增這個 Feature 的 handler
   （參考 `user.handlers.ts`：GET 用 `delay()` 模擬網路延遲，POST 至少涵蓋
   Success / Validation error / Server error 三種情境）。
2. 在 `src/mocks/handlers.ts` 把新的 handler 陣列展開進 `handlers`。
3. 如果 handler 需要「可重置的假資料庫」，仿照 `resetMockUsers()` 的作法匯出一個
   reset 函式，並在 `src/test/setup.ts` 的 `afterEach` 呼叫，避免測試互相汙染。

## 19. 如何新增 DataTable Column

`columnDefs` 直接使用 ag-Grid 官方的 `ColDef<TData>[]`，不需要學習額外的抽象：

```tsx
const columnDefs: ColDef<User>[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'email', headerName: 'Email' },
];
```

進階功能（Set Filter、Row Grouping、Side Bar…）透過 `gridOptions` prop 直接使用
ag-Grid 原生 API，`DataTable` 不會替每個功能重新設計一個自訂 prop。

設定優先順序：**DataTable 明確 props > Feature 傳入的 `gridOptions` > 全系統預設設定**
（見 `DataTable.tsx` 內的合併邏輯）。

## 20. 如何使用共用 Cell Renderer

`src/shared/components/DataTable/cell-renderers/`：

| Renderer | 用途 |
| --- | --- |
| `LinkCellRenderer` | 站內（`to`）或站外（`href`）連結，兩者擇一 |
| `IconTooltipCellRenderer` | 帶 Tooltip 的圖示，只有給 `onIconClick` 才會渲染成可互動的按鈕 |
| `ActionButtonsCellRenderer` | 一列 Action 按鈕（`hidden` / `disabled` / `tooltip` 皆可用 row 動態決定） |
| `TooltipCellRenderer` | 文字截斷 + 只有真的 overflow 時才顯示 Tooltip |
| `TagCellRenderer` | 文字 + 一個或多個 Tag，顏色 mapping 由 Feature 決定 |
| `DateTimeCellRenderer` | 統一日期時間格式（邏輯集中在 `shared/utils/datetime.ts`） |
| `EmptyValueCellRenderer` | 統一把 `null`/`undefined`/空字串顯示為 `—` |

範例（`UserListPage.tsx` 的 Status 欄位）：

```tsx
{
  field: 'status',
  headerName: 'Status',
  cellRenderer: TagCellRenderer<User>,
  cellRendererParams: {
    tags: (row: User) => [{ label: row.status, color: USER_STATUS_TAG_COLOR[row.status] }],
  },
}
```

## 21. 如何新增 Feature-specific Cell Renderer

如果某個 Renderer 包含特定業務概念（例如 `UserStatusCell`），**不要**放進
`shared/components/DataTable/cell-renderers/`。做法：

1. 在該 Feature 底下建立 `components/cell-renderers/<Name>.tsx`。
2. 如果只是「通用 Renderer + 業務 mapping」（像 Status 顏色），優先考慮直接用
   `TagCellRenderer`/`ActionButtonsCellRenderer` 搭配 Feature 自己的 mapping 函式
   （例如 `USER_STATUS_TAG_COLOR`），不一定需要另外寫一個新元件。

## 22. 何時使用 TanStack Query、Zustand、React Hook Form、useState

```text
API response（伺服器資料）    → TanStack Query
Form state                   → React Hook Form
單一元件內的區域 UI 狀態       → useState
跨頁面/跨元件的 Client State  → Zustand
登入狀態                      → AuthProvider（見 useAuth）
```

**不要**把 API response 複製進 Zustand。目前 MVP（使用者管理）沒有真正跨頁面的
Client State，所以沒有強行加入 Zustand store；Zustand 已安裝好，等真的出現需求
（例如跨頁面共用的篩選條件、UI 偏好設定）再建立 store。

## 23. Shared 元件判斷原則

只有「真正不含特定業務概念，且會被多個 Feature 使用」的能力才放進 `shared`：

```text
適合 Shared：AppButton、ConfirmDialog 類、DataTable、apiClient、PermissionGuard、PageContainer
不適合 Shared：UserStatusCell、SuspendUserDialog、userApi、canDeleteUser
```

判斷方式：把這個東西名字裡的業務詞（User、Ticket、Order…）拿掉之後，敘述還成立嗎？
成立就適合放 Shared，不成立就留在 Feature 裡。

## 24. 常見問題與 Troubleshooting

**`npm install` 印出 Husky 相關的訊息或跳過安裝？**
正常。Husky 需要 `.git` 目錄才能安裝 hook；如果這個資料夾還沒 `git init`，
`prepare` script（`scripts/prepare.mjs`）會直接跳過並印出說明，不會讓
`npm install` 失敗。等你 `git init` 之後，重新執行 `npm install`（或直接
`npx husky`）即可啟用 `.husky/pre-commit`（會執行 `lint-staged`）。

**表格沒有資料，也沒有錯誤訊息？**
確認 `.env` 的 `VITE_ENABLE_MSW=true` 且是 `npm run dev`（`DEV` 模式），
MSW 才會啟動；正式環境／`npm run build` 出來的產物不會、也不應該啟用 MSW。

**Keycloak 模式下網頁一直重新整理或卡住？**
先確認 `.env` 的三個 `VITE_KEYCLOAK_*` 變數是否都正確填寫——缺漏會在啟動時就
丟出清楚的錯誤訊息（見 `src/app/config/env.ts`），而不是進到不明的 redirect loop。
`checkLoginIframe` 目前預設關閉，如果仍遇到重整問題，請確認 Keycloak Client 的
Web Origins / Redirect URI 設定是否正確。

**ag-Grid 表格角落出現浮水印？**
代表 `VITE_AG_GRID_LICENSE_KEY` 沒有設定——這是 ag-Grid Enterprise 官方的
evaluation 行為，不是 bug，也不會讓應用程式崩潰。正式環境請在部署設定中
填入真實的 License Key（不要提交進版控）。

**如何知道目前是 mock 還是 keycloak 登入模式？**
看 `.env` 的 `VITE_AUTH_MODE`；`AppLayout` 右上角會顯示目前登入使用者的名稱，
mock 模式固定顯示「Demo User」。
