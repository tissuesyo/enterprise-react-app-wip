import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from '@mui/material';
import { FormTextField } from '@/shared/components/FormTextField';
import { FormSelect } from '@/shared/components/FormSelect';
import { AppButton } from '@/shared/components/AppButton';
import { createUserFormSchema, type CreateUserFormValues } from '@/features/users/api/user.schemas';
import { USER_ROLE_OPTIONS } from '@/features/users/domain/user.constants';

export interface UserFormProps {
  onSubmit: (values: CreateUserFormValues) => void;
  isSubmitting: boolean;
}

/**
 * Create User 的表單本體。獨立成元件（而不是直接寫在 CreateUserPage 裡），
 * 方便未來如果要做「Edit User」，可以重用同一份欄位定義與驗證規則。
 */
export function UserForm({ onSubmit, isSubmitting }: UserFormProps): ReactNode {
  const { control, handleSubmit } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: { name: '', email: '', role: undefined, age: undefined },
  });

  return (
    <Stack
      component="form"
      spacing={3}
      sx={{ maxWidth: 480 }}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <FormTextField name="name" control={control} label="Name" required />
      <FormTextField name="email" control={control} label="Email" type="email" required />
      <FormSelect name="role" control={control} label="Role" required options={USER_ROLE_OPTIONS} />
      <FormTextField name="age" control={control} label="Age" type="number" required />
      {/* 用 MUI Button 內建的 loading prop 防止重複送出，並顯示 loading 中的視覺回饋。 */}
      <AppButton
        type="submit"
        loading={isSubmitting}
        disabled={isSubmitting}
        sx={{ alignSelf: 'flex-start' }}
      >
        Create User
      </AppButton>
    </Stack>
  );
}
