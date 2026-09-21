import { useMemo, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ColDef } from 'ag-grid-community';
  DialogTitle,
import { Alert, Snackbar, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PageContainer } from '@/shared/components/PageContainer';
import { AppButton } from '@/shared/components/AppButton';
import { ErrorState } from '@/shared/components/ErrorState';
import { Modal } from '@/shared/components/Modal';
import {
  ActionButtonsCellRenderer,
  DataTable,
  LinkCellRenderer,
  TagCellRenderer,
  type CellAction,
} from '@/shared/components/DataTable';
import { useUsersQuery } from '@/features/users/api/user.queries';
import { canDeleteUser, USER_STATUS_TAG_COLOR } from '@/features/users/domain/user.constants';
import type { User } from '@/features/users/types/user.types';

/**
 * /users
 *
 * Name 欄位與 Actions 的 View 都導向 /users/:id（唯讀 UserDetailPage）。
 * Delete 則示範「Feature 決定 disabled 條件（canDeleteUser）」，
 * 但 MVP 沒有對應的後端 Delete API，因此點擊後用 Dialog 顯示「尚未實作」的說明，
 * 而不是假裝呼叫一個不存在的 API。
 */
export interface UserListLocationState {
  userCreated?: boolean;
}

export function UserListPage(): ReactNode {
  const { data, isLoading, isError, error, refetch } = useUsersQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const [stubDialogUser, setStubDialogUser] = useState<User | undefined>(undefined);

  const locationState = location.state as UserListLocationState | null;
  const [successOpen, setSuccessOpen] = useState(Boolean(locationState?.userCreated));

  function dismissSuccess(): void {
    setSuccessOpen(false);
    // 清掉 navigation state，避免使用者重新整理這個頁面時 Snackbar 又跳出來一次。
    // navigate() 回傳 `void | Promise<void>`（React Router 7 的 View Transitions 支援），
    // 這裡不需要等待完成，用 `void` 明確表示「刻意不處理這個 Promise」。
    void navigate(location.pathname, { replace: true, state: null });
  }

  const columnDefs = useMemo<ColDef<User>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        cellRenderer: LinkCellRenderer<User>,
        cellRendererParams: {
          to: (row: User) => `/users/${row.id}`,
        } satisfies Partial<Parameters<typeof LinkCellRenderer<User>>[0]>,
        minWidth: 160,
      },
      { field: 'email', headerName: 'Email', minWidth: 220 },
      { field: 'role', headerName: 'Role', minWidth: 120 },
      { field: 'age', headerName: 'Age', minWidth: 90, maxWidth: 110 },
      {
        field: 'status',
        headerName: 'Status',
        minWidth: 140,
        cellRenderer: TagCellRenderer<User>,
        cellRendererParams: {
          tags: (row: User) => [{ label: row.status, color: USER_STATUS_TAG_COLOR[row.status] }],
        } satisfies Partial<Parameters<typeof TagCellRenderer<User>>[0]>,
      },
      {
        headerName: 'Actions',
        minWidth: 200,
        sortable: false,
        filter: false,
        cellRenderer: ActionButtonsCellRenderer<User>,
        cellRendererParams: {
          actions: [
            {
              id: 'view',
              label: 'View',
              // CellAction.onClick 要求回傳 void；navigate() 回傳 `void | Promise<void>`，
              // 用 `void` 把這個呼叫式的回傳值丟棄，讓箭頭函式本身仍然是 void 回傳。
              onClick: (row: User) => void navigate(`/users/${row.id}`),
            },
            {
              id: 'delete',
              label: 'Delete',
              color: 'error',
              disabled: (row: User) => !canDeleteUser(row),
              tooltip: (row: User) =>
                canDeleteUser(row) ? '刪除此使用者' : 'Admin 或非啟用狀態的使用者不可刪除',
              onClick: (row: User) => setStubDialogUser(row),
            },
          ] satisfies CellAction<User>[],
        },
      },
    ],
    [navigate],
  );

  if (isError) {
    return (
      <PageContainer title="Users">
        <ErrorState description={error.message} onRetry={() => void refetch()} />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Users"
      actions={
        <AppButton startIcon={<AddIcon />} onClick={() => void navigate('/users/new')}>
          Create User
        </AppButton>
      }
    >
      <DataTable<User>
        columnDefs={columnDefs}
        rowData={data}
        loading={isLoading}
        emptyMessage="目前沒有使用者，點擊右上角「Create User」新增一筆。"
        getRowId={(params) => params.data.id}
        pagination
      />

      <Modal
        open={Boolean(stubDialogUser)}
        onClose={() => setStubDialogUser(undefined)}
        title={`Delete ${stubDialogUser?.name}?`}
      >
        <Typography variant="body2" color="text.secondary">
          這是示範用的 Delete 確認 Dialog。MVP 尚未提供對應的 Delete API， 實際專案應在這裡串接
          features/users/api 底下新增的 delete mutation。
        </Typography>
      </Modal>

      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={dismissSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={dismissSuccess}>
          使用者建立成功
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}
