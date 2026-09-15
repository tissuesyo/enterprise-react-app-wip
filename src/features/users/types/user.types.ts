export type UserRole = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  age: number;
  status: UserStatus;
  createdAt: string;
}

// 建立使用者的 Input 型別由 Zod schema 推導（見 api/user.schemas.ts 的 CreateUserFormValues），
// 刻意不在這裡重複手寫一份，避免 schema 跟型別兩邊改一個忘了改另一個。
