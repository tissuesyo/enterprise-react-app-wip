import { useState, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/app/config/queryClient';

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * 用 useState 的 initializer 建立「每個 App instance 一個」QueryClient，
 * 而不是 module-level 的單例——這樣同一份程式碼在測試中
 * 用 renderWithProviders 重新掛載時，每個測試都會拿到全新的 cache，不會互相污染。
 */
export function QueryProvider({ children }: QueryProviderProps): ReactNode {
  const [queryClient] = useState(() => createQueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
