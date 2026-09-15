import { describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import { UserForm } from './UserForm';

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name/i), 'Alice Chen');
  await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
  await user.click(screen.getByLabelText(/role/i));
  await user.click(within(screen.getByRole('listbox')).getByText('Admin'));
  await user.type(screen.getByLabelText(/age/i), '30');
}

describe('UserForm validation', () => {
  it('shows a required error when Name is left blank', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(<UserForm onSubmit={onSubmit} isSubmitting={false} />);

    await user.click(screen.getByRole('button', { name: /create user/i }));

    expect(await screen.findByText(/姓名至少需要 2 個字元/)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows an error for an invalid email format', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(<UserForm onSubmit={onSubmit} isSubmitting={false} />);

    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /create user/i }));

    expect(await screen.findByText(/Email 格式不正確/)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows an error when age is below 18', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(<UserForm onSubmit={onSubmit} isSubmitting={false} />);

    await user.type(screen.getByLabelText(/age/i), '17');
    await user.click(screen.getByRole('button', { name: /create user/i }));

    expect(await screen.findByText(/年齡不可小於 18 歲/)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows an error when age is above 100', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(<UserForm onSubmit={onSubmit} isSubmitting={false} />);

    await user.type(screen.getByLabelText(/age/i), '101');
    await user.click(screen.getByRole('button', { name: /create user/i }));

    expect(await screen.findByText(/年齡不可大於 100 歲/)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with parsed values when the form is valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(<UserForm onSubmit={onSubmit} isSubmitting={false} />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /create user/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Alice Chen',
      email: 'alice@example.com',
      role: 'admin',
      age: 30,
    });
  });
});
