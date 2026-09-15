import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppButton } from './AppButton';

describe('AppButton', () => {
  it('renders children and responds to click', async () => {
    const handleClick = vi.fn();
    render(<AppButton onClick={handleClick}>Save</AppButton>);

    const button = screen.getByRole('button', { name: 'Save' });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('maps the "danger" intent to an error-colored button', () => {
    render(<AppButton intent="danger">Delete</AppButton>);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button.className).toMatch(/colorError/);
  });

  it('supports being disabled like a native MUI Button', () => {
    render(<AppButton disabled>Disabled</AppButton>);
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });
});
