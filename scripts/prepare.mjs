// husky 的 install 動作需要 .git 目錄才能運作；
// 這個 wrapper 讓「還沒 git init 的專案」也能正常完成 npm install，
// 不會因為找不到 .git 就讓整個 `npm install` 失敗。
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

if (existsSync('.git')) {
  execSync('husky', { stdio: 'inherit' });
} else {
  console.log(
    '[prepare] 尚未偵測到 .git，略過 Husky hook 安裝。' +
      '請在 `git init` 之後重新執行 `npm install`（或直接執行 `npx husky`）以啟用 pre-commit hook。',
  );
}
