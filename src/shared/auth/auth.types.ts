/**
 * Auth 相關的共用型別。
 * 刻意跟 Keycloak 的型別分開（不要直接把 Keycloak.KeycloakProfile 之類的型別
 * 洩漏到整個系統），這樣未來如果換掉 Keycloak，商業元件不需要跟著改型別。
 */
export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  roles: string[];
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | undefined;
  token: string | undefined;
  hasRole: (role: string) => boolean;
  logout: () => void;
}
