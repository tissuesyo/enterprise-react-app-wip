import { setupWorker } from 'msw/browser';
import { handlers } from '@/mocks/handlers';

/**
 * 給瀏覽器（本機開發 / Playwright E2E）使用的 MSW worker。
 * 是否啟動由呼叫端（main.tsx）依 `DEV && VITE_ENABLE_MSW === 'true'` 判斷，
 * 這個檔案本身不重複做這個判斷，只負責「啟動」這個動作。
 */
export async function startMockServiceWorker(): Promise<void> {
  const worker = setupWorker(...handlers);
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
  });
}
