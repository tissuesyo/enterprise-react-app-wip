import { userHandlers } from '@/mocks/handlers/user.handlers';

/**
 * 全域 handlers 組裝點。新增一個 Feature 的 mock 時：
 * 在 mocks/handlers/<feature>.handlers.ts 建立該 Feature 的 handler，
 * 再匯入、展開進這個陣列即可，不要把所有 handler 都寫在同一個檔案裡。
 */
export const handlers = [...userHandlers];
