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

// jsdom 完全不執行真正的版面配置（layout），所有元素的 offsetHeight/clientHeight
// 永遠是 0。ag-Grid 的列虛擬化（row virtualization）需要用容器的實際高度來決定
// 要渲染幾列，容器高度是 0 時 ag-Grid 會認為「viewport 沒有空間」而不渲染任何 row，
// 導致測試永遠找不到資料列（這是 ag-Grid 官方也承認的 jsdom 已知限制）。
// 這裡把 offsetHeight/offsetWidth/clientHeight/clientWidth 固定回傳一個合理的數值，
// 讓 ag-Grid 在測試環境中誤以為容器有實際尺寸、進而正常渲染列與 overlay。
const FIXED_LAYOUT_SIZE = 600;
for (const property of ['offsetHeight', 'offsetWidth', 'clientHeight', 'clientWidth'] as const) {
  Object.defineProperty(HTMLElement.prototype, property, {
    configurable: true,
    value: FIXED_LAYOUT_SIZE,
  });
}
