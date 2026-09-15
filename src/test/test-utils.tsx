import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { createQueryClient } from '@/app/config/queryClient';
import { theme } from '@/shared/theme/theme';
import { AuthContext } from '@/shared/auth/useAuth';
import type { AuthContextValue, AuthUser } from '@/shared/auth/auth.types';

const DEFAULT_TEST_USER: AuthUser = {
  id: 'test-user',
  username: 'test.user',
  displayName: 'Test User',
  roles: ['user', 'admin'],
};

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /** 進入測試時的路由路徑，預設 "/"。 */
  route?: string;
  /** 覆蓋預設的 mock 登入使用者/角色，測試權限相關情境時使用。 */
  authOverrides?: Partial<AuthContextValue>;
}

/**
 * 測試共用的 render helper：包好 MemoryRouter、QueryClient、MUI Theme、Mock Auth。
 * 每次呼叫都會建立全新的 QueryClient（透過 createQueryClient()），
 * 確保不同測試案例之間的 React Query cache 不會互相污染。
 */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/', authOverrides, ...renderOptions }: RenderWithProvidersOptions = {},
) {
  const queryClient = createQueryClient();

  const authValue: AuthContextValue = {
    isAuthenticated: true,
    isLoading: false,
    user: DEFAULT_TEST_USER,
    token: 'test-token',
    hasRole: (role) => DEFAULT_TEST_USER.roles.includes(role),
    logout: () => {},
    ...authOverrides,
  };

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <AuthContext value={authValue}>{children}</AuthContext>
          </QueryClientProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
  }

  return { queryClient, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react';
