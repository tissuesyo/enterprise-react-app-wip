/**
 * 集中式、具型別的 environment config。
 *
 * 為什麼要這樣做：
 * - 業務元件如果到處寫 `import.meta.env.VITE_XXX`，會遇到兩個問題：
 *   1. 型別是 `string | undefined`，很容易漏掉檢查就直接使用。
 *   2. 一旦漏填某個變數，通常要等到程式執行到那一行才會爆炸，
 *      而且錯誤訊息往往是難以理解的 undefined/null 錯誤。
 * - 這裡在應用程式啟動時就一次檢查、一次轉型，
 *   之後其他程式碼只需要 `import { env } from '@/app/config/env'`，
 *   拿到的就是型別正確、已驗證過的值。
 */

export type AuthMode = 'mock' | 'keycloak';

interface AppEnv {
  apiBaseUrl: string;
  enableMsw: boolean;
  authMode: AuthMode;
  keycloak: {
    url: string;
    realm: string;
    clientId: string;
  };
  agGridLicenseKey: string | undefined;
}

/** 讀取必填字串變數；缺少時拋出清楚的錯誤訊息（只在真的需要時才會呼叫，見下方 authMode 分流）。 */
function requireString(key: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new Error(
      `[env] 缺少必要的環境變數 "${key}"。請確認 .env（可參考 .env.example）已正確設定。`,
    );
  }
  return value;
}

function parseAuthMode(value: string | undefined): AuthMode {
  if (value === 'keycloak') return 'keycloak';
  if (value === 'mock' || value === undefined || value === '') return 'mock';
  throw new Error(`[env] VITE_AUTH_MODE 只能是 "mock" 或 "keycloak"，目前收到的值是 "${value}"。`);
}

function buildEnv(): AppEnv {
  const raw = import.meta.env;
  const authMode = parseAuthMode(raw.VITE_AUTH_MODE);

  // Keycloak 相關變數只有在 authMode === 'keycloak' 時才是必填，
  // 這樣本機用 mock 模式開發時，不需要準備真實 Keycloak 設定也能啟動。
  const keycloak =
    authMode === 'keycloak'
      ? {
          url: requireString('VITE_KEYCLOAK_URL', raw.VITE_KEYCLOAK_URL),
          realm: requireString('VITE_KEYCLOAK_REALM', raw.VITE_KEYCLOAK_REALM),
          clientId: requireString('VITE_KEYCLOAK_CLIENT_ID', raw.VITE_KEYCLOAK_CLIENT_ID),
        }
      : {
          url: raw.VITE_KEYCLOAK_URL ?? '',
          realm: raw.VITE_KEYCLOAK_REALM ?? '',
          clientId: raw.VITE_KEYCLOAK_CLIENT_ID ?? '',
        };

  return {
    apiBaseUrl: raw.VITE_API_BASE_URL ?? '/api',
    enableMsw: raw.VITE_ENABLE_MSW === 'true',
    authMode,
    keycloak,
    agGridLicenseKey:
      raw.VITE_AG_GRID_LICENSE_KEY && raw.VITE_AG_GRID_LICENSE_KEY.trim() !== ''
        ? raw.VITE_AG_GRID_LICENSE_KEY
        : undefined,
  };
}

export const env: AppEnv = buildEnv();
