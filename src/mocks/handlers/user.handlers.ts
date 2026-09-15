import { delay, http, HttpResponse } from 'msw';
import { initialMockUsers } from '@/mocks/data/users';
import type { User } from '@/features/users/types/user.types';
import type { CreateUserFormValues } from '@/features/users/api/user.schemas';

// 用一個 module-level 陣列模擬「資料庫」，這樣 POST 成功後，GET /api/users 馬上就能看到新資料——
// 這是 Playwright E2E（新增後回到列表要看得到）能通過的關鍵。
// 注意：這個陣列只活在瀏覽器分頁 / 測試 process 的記憶體中，重新整理頁面就會重置，這是 mock 的預期行為。
let mockUsers: User[] = [...initialMockUsers];

/** 讓測試可以在每個 it()/test() 開始前重置成初始狀態，避免測試之間互相污染資料。 */
export function resetMockUsers(): void {
  mockUsers = [...initialMockUsers];
}

let nextId = mockUsers.length + 1;

export const userHandlers = [
  http.get('/api/users', async () => {
    await delay(150);
    return HttpResponse.json(mockUsers);
  }),

  http.post('/api/users', async ({ request }) => {
    await delay(300);

    const body = (await request.json()) as Partial<CreateUserFormValues>;

    // 刻意保留的「觸發特定情境」慣例，方便測試/開發時穩定重現 Server error，
    // 不需要真的讓後端狀態壞掉才能測試錯誤畫面。詳見 README「MSW」章節。
    if (body.email === 'server-error@example.com') {
      return HttpResponse.json(
        { message: '伺服器暫時發生問題，請稍後再試一次。' },
        { status: 500 },
      );
    }

    if (mockUsers.some((existing) => existing.email === body.email)) {
      return HttpResponse.json(
        { message: 'Email 已經被其他使用者使用', code: 'EMAIL_TAKEN' },
        { status: 409 },
      );
    }

    if (!body.name || !body.email || !body.role || typeof body.age !== 'number') {
      return HttpResponse.json({ message: '欄位不完整或格式錯誤' }, { status: 400 });
    }

    const newUser: User = {
      id: `usr_${nextId++}`,
      name: body.name,
      email: body.email,
      role: body.role,
      age: body.age,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    mockUsers = [...mockUsers, newUser];

    return HttpResponse.json(newUser, { status: 201 });
  }),
];
