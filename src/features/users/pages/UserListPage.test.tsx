import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { server } from '@/mocks/server';
import { UserListPage } from './UserListPage';

describe('UserListPage (Query + MSW integration)', () => {
  it('shows a loading state before data arrives', () => {
    renderWithProviders(<UserListPage />);
    expect(screen.getByText('載入中…')).toBeInTheDocument();
  });

  it('renders users returned by the mock API', async () => {
    renderWithProviders(<UserListPage />);

    await waitForElementToBeRemoved(() => screen.queryByText('載入中…'));

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
