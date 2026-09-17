import { z } from 'zod';

/**
 * Create User 表單的 Zod schema——這是唯一的 schema 定義來源，
 * 型別（CreateUserFormValues）直接用 z.infer 推導，不重複手寫一份 TypeScript interface。
 */
export const createUserFormSchema = z.object({
  name: z.string().trim().min(2, '姓名至少需要 2 個字元').max(50, '姓名不可超過 50 個字元'),

  email: z.string().trim().min(1, '請輸入 Email').email('Email 格式不正確'),

  role: z.enum(['admin', 'editor', 'viewer'], {
    required_error: '請選擇角色',
    invalid_type_error: '請選擇有效的角色',
  }),

  // HTML input 的原生值一律是字串，即使 type="number" 也一樣；
  // 這裡用 preprocess 把空字串視為「未填」，其餘轉成 number 之後再交給下面的規則驗證，
  // 避免 z.coerce.number() 把空字串誤判成 0 而通過必填檢查。
  age: z.preprocess(
    (value) => {
      if (value === '' || value === null || value === undefined) return undefined;
      const num = typeof value === 'string' ? Number(value) : value;
      return typeof num === 'number' && Number.isNaN(num) ? undefined : num;
    },
    z
      .number({ required_error: '請輸入年齡', invalid_type_error: '年齡必須是數字' })
      .int('年齡必須是整數')
      .min(18, '年齡不可小於 18 歲')
      .max(100, '年齡不可大於 100 歲'),
  ),
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;
