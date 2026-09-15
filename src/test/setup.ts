import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from '@/mocks/server';
import { resetMockUsers } from '@/mocks/handlers/user.handlers';

// 所有測試共用同一個 MSW server；每個測試檔案不需要自己重新 setupServer。
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  resetMockUsers();
});
afterAll(() => server.close());

// jsdom 沒有內建 ResizeObserver，但 ag-Grid 依賴它做欄寬/版面計算；
// 測試環境提供一個最小可用的假實作即可，不需要真的量測尺寸。
class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- jsdom 全域型別本來就沒有 ResizeObserver，這是最小範圍的 polyfill 賦值。
(globalThis as any).ResizeObserver = ResizeObserverStub;

// jsdom 沒有實作 matchMedia，MUI 部分元件（例如 useMediaQuery）會用到。
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
