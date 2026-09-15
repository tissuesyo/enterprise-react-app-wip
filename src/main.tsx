import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';

/**
 * MSW 必須在整個 App render 之前完成啟動（否則第一批 API 請求會打到真實網路而失敗），
 * 所以這裡用 async bootstrap function，而不是直接呼叫 createRoot().render()。
 */
async function bootstrap(): Promise<void> {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === 'true') {
    const { startMockServiceWorker } = await import('@/mocks/browser');
    await startMockServiceWorker();
  }

  const container = document.getElementById('root');
  if (!container) {
    throw new Error('找不到 #root 節點，無法掛載 React App。');
  }

  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();
