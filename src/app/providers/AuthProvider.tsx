import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { env } from '@/app/config/env';
import { setAccessTokenGetter } from '@/shared/api/apiClient';
import { AuthContext } from '@/shared/auth/useAuth';
import type { AuthContextValue, AuthUser } from '@/shared/auth/auth.types';
import {
  initKeycloak,
  logoutKeycloak,
  mapKeycloakProfileToAuthUser,
  registerTokenAutoRefresh,
} from '@/shared/auth/keycloak';

/** Mock 模式使用的假使用者：本機開發、單元測試、Playwright E2E 都靠它跑，不依賴任何後端。 */
const MOCK_USER: AuthUser = {
  id: 'mock-user-1',
  username: 'demo.user',
  displayName: 'Demo User',
  roles: ['user', 'admin'],
};
const MOCK_TOKEN = 'mock-access-token';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): ReactNode {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);
  // React Strict Mode 下 effect 會執行兩次；用 ref 記錄「是否已經開始初始化」，
  // 避免 mock 模式下重複 setState，以及 keycloak 模式下重複呼叫 init。
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (env.authMode === 'mock') {
      setUser(MOCK_USER);
      setToken(MOCK_TOKEN);
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    initKeycloak()
      .then(({ keycloak, authenticated }) => {
        if (!authenticated) {
          // onLoad: 'login-required' 理論上此時瀏覽器已經在導向登入頁的路上，
          // 這裡不再手動呼叫 keycloak.login()，避免產生無限 redirect loop。
          setIsLoading(false);
          return;
        }
        registerTokenAutoRefresh(keycloak);
        setUser(mapKeycloakProfileToAuthUser(keycloak));
        setToken(keycloak.token);
        setIsAuthenticated(true);
        setIsLoading(false);

        keycloak.onAuthRefreshSuccess = () => {
          setToken(keycloak.token);
        };
      })
      .catch((error: unknown) => {
        console.error('[AuthProvider] Keycloak 初始化失敗', error);
        setIsLoading(false);
      });
  }, []);

  // 讓 apiClient 可以在每次呼叫 API 時，都拿到「當下」最新的 token，
  // 而不是初始化那一刻的舊值（避免 refresh 之後 apiClient 還在用過期 token）。
  const tokenRef = useRef(token);
  tokenRef.current = token;
  useEffect(() => {
    setAccessTokenGetter(() => tokenRef.current);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      token,
      hasRole: (role: string) => user?.roles.includes(role) ?? false,
      logout: () => {
        if (env.authMode === 'mock') {
          setIsAuthenticated(false);
          setUser(undefined);
          setToken(undefined);
          return;
        }
        logoutKeycloak();
      },
    }),
    [isAuthenticated, isLoading, user, token],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
