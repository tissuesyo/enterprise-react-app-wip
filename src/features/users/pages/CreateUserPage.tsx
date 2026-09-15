import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import { PageContainer } from '@/shared/components/PageContainer';
import { UserForm } from '@/features/users/components/UserForm';
import { useCreateUserMutation } from '@/features/users/api/user.mutations';
import { ApiError } from '@/shared/api/ApiError';
import type { CreateUserFormValues } from '@/features/users/api/user.schemas';
import type { UserListLocationState } from '@/features/users/pages/UserListPage';

/** /users/new */
export function CreateUserPage(): ReactNode {
  const navigate = useNavigate();
  const mutation = useCreateUserMutation();

  function handleSubmit(values: CreateUserFormValues): void {
    // mutation.isPending 已經會讓 UserForm 的送出按鈕 disabled，這裡再擋一次，
    // 防止使用者用非滑鼠方式（例如連按 Enter）觸發重複送出。
    if (mutation.isPending) return;

    mutation.mutate(values, {
      onSuccess: () => {
        // 成功訊息用 navigation state 帶到 /users 顯示，而不是在這個即將卸載的頁面上開 Snackbar
        // ——那樣使用者根本來不及看到就已經跳轉了。
        navigate('/users', { state: { userCreated: true } satisfies UserListLocationState });
      },
      // 失敗時刻意「不」navigate、也不清空表單，讓使用者可以照原本填的內容修正後重試。
    });
  }

  const errorMessage = ApiError.isApiError(mutation.error)
    ? mutation.error.message
    : mutation.error?.message;

  return (
    <PageContainer title="Create User">
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, maxWidth: 480 }}>
          {errorMessage}
        </Alert>
      )}
      <UserForm onSubmit={handleSubmit} isSubmitting={mutation.isPending} />
    </PageContainer>
  );
}
