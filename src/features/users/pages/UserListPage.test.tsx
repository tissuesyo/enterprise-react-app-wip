import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { server } from '@/mocks/server';
import { UserListPage } from './UserListPage';

describe('UserListPage (Query + MSW integration)', () => {
  it('shows a loading state before data arrives', async () => {
    renderWithProviders(<UserListPage />);
    // ag-Grid 的 loading overlay 是在 grid 初始化完成（非同步）之後才顯示，
    // render() 呼叫完當下還不會馬上出現，要用 waitFor 等待。
    await waitFor(() => expect(screen.getByText('載入中…')).toBeInTheDocument());
  });

  it('renders users returned by the mock API', async () => {
    renderWithProviders(<UserListPage />);

    expect(await screen.findByText('Alice Chen')).toBeInTheDocument();
    expect(screen.getByText('Ben Wu')).toBeInTheDocument();
  });

  it('shows an error state when the API call fails', async () => {
    server.use(
      http.get('/api/users', () =>
        HttpResponse.json({ message: '伺服器發生錯誤' }, { status: 500 }),
      ),
    );

    renderWithProviders(<UserListPage />);

    await waitFor(() => expect(screen.getByText('伺服器發生錯誤')).toBeInTheDocument());
  });
});
