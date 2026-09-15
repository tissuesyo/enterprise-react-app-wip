import { setupServer } from 'msw/node';
import { handlers } from '@/mocks/handlers';

/** 給 Vitest（Node 環境）使用的 MSW server，設定方式見 src/test/setup.ts。 */
export const server = setupServer(...handlers);
