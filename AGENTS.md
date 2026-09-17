# AGENTS.md

給 AI（opencode、Claude Code 或其他 coding agent）在這個專案工作時的規則。
每次任務開始前先讀這份文件，不要只看 README 就動手。

## 這個專案目前的狀態

- 這是一個 **prototype**，沒有正式 URD/PRD。需求會用「一句話 + 驗收條件」的方式直接
  在對話裡給你，不會有 Jira ticket 或規格文件可以查。
- 團隊成員大多**不熟悉前端開發**，不會自己 review 程式碼的技術細節，
  所以架構一致性、命名清楚、註解到位，比展示技巧更重要。
- 遇到需求不清楚、範圍不明確、或有兩種以上合理做法時，**先問清楚再動手**，
  不要自己假設一個方向就直接大量產生程式碼。

## 開始任何任務前必讀

1. `README.md` 第 11–23 節：目錄架構、各層責任、Feature 依賴規則、
   如何新增 Feature／頁面／API／表單欄位／DataTable Column／Cell Renderer。
2. 把 `src/features/users` 整個資料夾當作「新 Feature 的範本」——
   新增其他 Feature 時，資料夾結構、檔案命名、責任切分都照這個 Feature 的做法，
   不要自己發明新的組織方式。

## 嚴格規則（不可違反）

- 不准把 `fetch`/`axios` 直接寫在 React 元件裡；API 呼叫一律走
  `features/<name>/api/<name>.api.ts`，再包成 `features/<name>/api/<name>.queries.ts`
  或 `<name>.mutations.ts` 給元件使用。
- 不准新增以技術類型命名的全域資料夾（例如 `components/`、`pages/`、`services/`、
  `stores/`）。新業務功能一律用 Feature-based 的方式放進 `src/features/<name>/`。
- 不准安裝 Redux、Tailwind、Next.js、第二套 UI library，或任何未經確認的新套件
  （lodash 也一樣，除非有明確、具體的需求）。這是既有的技術選型限制，不是可以自行放寬的偏好。
- 新增 Feature 一律照 `src/features/users` 的資料夾結構
  （`pages/ components/ api/ types/ domain/ index.ts`），不要預先建立空的子資料夾。
- Shared 元件只放「真正不含特定業務概念、且會被多個 Feature 使用」的東西
  （判斷原則見 README 第 23 節）；業務邏輯（例如 `canDeleteUser`）留在對應的 Feature 裡。
- 不要為了展示能力而過度抽象、建立 Base Class / Repository / Factory / 複雜 domain
  framework，也不要為尚未發生的需求預先蓋大量空目錄。

## 每次改完程式碼之後

改完任何 TypeScript/TSX 檔案，必須依序執行並確保全部通過：

```bash
npm run typecheck
npm run lint
npm run test:run
```

有牽涉到頁面排版或視覺變化時，也跑一次：

```bash
npm run build
```

不要略過這一步，也不要用 `--no-verify`、`git commit --no-verify`、
`eslint --quiet` 之類的方式繞過檢查。如果某個檢查失敗，先修好再回報完成，
不要說「應該沒問題」就結束任務。

## Commit / Git 相關

- 不要自己執行 `git commit`、`git push`，除非使用者明確要求。
- 不要執行任何具破壞性的 git 指令（`git reset --hard`、`git clean -f`、
  強制 push 等），除非使用者明確要求。

## 每次任務交付時的回報格式

完成一個任務後，簡短說明：

1. 做了什麼改動（哪些檔案、屬於哪個 Feature）
2. 實際執行過哪些驗證指令、結果如何
3. 如果有需要使用者確認或提供資訊的地方，列出來

不要只回覆程式碼片段就結束，實際的檔案要真的寫進專案裡。
