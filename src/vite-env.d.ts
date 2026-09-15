/// <reference types="vite/client" />

// 讓 import.meta.env.VITE_XXX 有正確的型別提示，
// 實際的「缺值就報錯」邏輯集中在 src/app/config/env.ts。
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ENABLE_MSW?: string;
  readonly VITE_AUTH_MODE?: string;
  readonly VITE_KEYCLOAK_URL?: string;
  readonly VITE_KEYCLOAK_REALM?: string;
  readonly VITE_KEYCLOAK_CLIENT_ID?: string;
  readonly VITE_AG_GRID_LICENSE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
