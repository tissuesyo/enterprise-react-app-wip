import { QueryClient } from '@tanstack/react-query';

/**
 * 集中建立 QueryClient 的預設選項。
 * 之所以獨立成一個檔案（而不是直接寫在 Provider 裡）：
 * - 測試（renderWithProviders）需要「每個測試都建立全新的 QueryClient」，
 *   如果選項散落在各處，測試跟正式程式容易兜不起來。
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 預設不要瘋狂重試，UI 上的 loading/error 狀態才會符合使用者預期。
        retry: 1,
        // 避免使用者切換分頁又切回來時，畫面無意義地重新 fetch。
        refetchOnWindowFocus: false,
        staleTime: 30_000,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
