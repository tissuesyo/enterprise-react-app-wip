import type { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import { PageContainer } from '@/shared/components/PageContainer';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';
import { useUsersQuery } from '@/features/users/api/user.queries';

/**
 * /users/:id — 唯讀的使用者詳細資料。
 * 刻意重用 useUsersQuery 現有的 list cache 找出對應的 user，而不是另外呼叫一支
 * `GET /users/:id` API：MVP 的資料量小，且後端目前只提供 list/create 兩支端點（見 README）。
 * 如果之後資料量變大，可以再新增獨立的 `fetchUserById` + `useUserQuery(id)`。
 */
export function UserDetailPage(): ReactNode {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } = useUsersQuery();

  if (isLoading) {
    return (
      <PageContainer title="User Detail">
        <LoadingState />
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer title="User Detail">
        <ErrorState description={error.message} onRetry={() => void refetch()} />
      </PageContainer>
    );
  }

  const user = data?.find((candidate) => candidate.id === id);

  if (!user) {
    return (
      <PageContainer title="User Detail">
        <ErrorState title="找不到使用者" description={`找不到 id 為 "${id}" 的使用者。`} />
      </PageContainer>
    );
  }

  return (
    <PageContainer title={user.name}>
      <Stack spacing={1.5} sx={{ maxWidth: 480 }}>
        <DetailRow label="Email" value={user.email} />
        <DetailRow label="Role" value={user.role} />
        <DetailRow label="Age" value={String(user.age)} />
        <DetailRow label="Status" value={user.status} />
      </Stack>
    </PageContainer>
  );
}

function DetailRow({ label, value }: { label: string; value: string }): ReactNode {
  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="body2" color="text.secondary" sx={{ width: 96 }}>
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}
