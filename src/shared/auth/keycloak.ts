import Keycloak from 'keycloak-js';
import { env } from '@/app/config/env';
import type { AuthUser } from '@/shared/auth/auth.types';

/**
 * Keycloak 初始化模組。
 *
 * 設計重點：
 * - 全域只建立一個 Keycloak instance，並用 `initPromise` 記住「是否已經開始初始化」。
 *   React Strict Mode 在開發模式會刻意把 effect 執行兩次，如果每次都呼叫 `keycloak.init()`，
 *   Keycloak adapter 會丟出 "already initialized" 錯誤，所以這裡用 module-level 變數擋住重複呼叫。
 * - Token 只保存在記憶體（模組變數）中，不寫進 localStorage，
 *   降低 XSS 情境下 token 被竊取的風險；重新整理頁面後會透過 Keycloak
 *   的 silent SSO / iframe check 重新取得，而不是從 localStorage 讀回來。
 */
let keycloakInstance: Keycloak | undefined;
let initPromise: Promise<boolean> | undefined;

function getKeycloakInstance(): Keycloak {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak({
      url: env.keycloak.url,
      realm: env.keycloak.realm,
      clientId: env.keycloak.clientId,
    });
  }
  return keycloakInstance;
}

export interface KeycloakInitResult {
  keycloak: Keycloak;
  authenticated: boolean;
}

/**
 * 初始化 Keycloak（未登入時會導向登入頁）。
 * 回傳同一個 Promise 給所有呼叫者，確保只執行一次真正的 init 流程。
 */
export function initKeycloak(): Promise<KeycloakInitResult> {
  const keycloak = getKeycloakInstance();

  if (!initPromise) {
    initPromise = keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      // 關閉 login-status iframe 檢查，避免部分企業內網／代理環境下
      // 產生無限重新整理或 redirect loop 的問題；token 過期改用下方的
      // onTokenExpired + updateToken 機制處理。
      checkLoginIframe: false,
    });
  }

  return initPromise.then((authenticated) => ({ keycloak, authenticated }));
}

/** Token 即將到期時嘗試 refresh；失敗就導回登入頁，避免使用者卡在「看似登入但 API 都 401」的狀態。 */
export function registerTokenAutoRefresh(keycloak: Keycloak): void {
  keycloak.onTokenExpired = () => {
    keycloak.updateToken(30).catch(() => {
      // login() 會導向登入頁（回傳的 Promise 在瀏覽器導頁前通常不會 resolve），
      // 這裡不需要等待或處理它的結果，用 `void` 明確表示刻意不處理。
      void keycloak.login();
    });
  };
}

export function mapKeycloakProfileToAuthUser(keycloak: Keycloak): AuthUser {
  const parsedToken = keycloak.tokenParsed as
    | { sub?: string; preferred_username?: string; name?: string }
    | undefined;
  const realmRoles = keycloak.realmAccess?.roles ?? [];

  return {
    id: parsedToken?.sub ?? 'unknown',
    username: parsedToken?.preferred_username ?? 'unknown',
    displayName: parsedToken?.name ?? parsedToken?.preferred_username ?? 'Unknown User',
    roles: realmRoles,
  };
}

export function logoutKeycloak(): void {
  // logout() 會導向 Keycloak 的登出頁面再導回來，這裡不需要等待它的 Promise。
  void keycloakInstance?.logout({ redirectUri: window.location.origin });
}
