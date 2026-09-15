import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ActionButtonsCellRendererParams, CellAction } from './ActionButtonsCellRenderer';
import { ActionButtonsCellRenderer } from './ActionButtonsCellRenderer';

interface Row {
  id: string;
  name: string;
  canDelete: boolean;
}

const row: Row = { id: '1', name: 'Alice', canDelete: false };

// ag-Grid 在真正的 grid 中會提供完整的 ICellRendererParams；
// 測試只需要元件實際會用到的欄位，其餘用最小範圍的型別轉換帶過。
function buildParams(actions: CellAction<Row>[]): ActionButtonsCellRendererParams<Row> {
  return { data: row, actions } as unknown as ActionButtonsCellRendererParams<Row>;
}

describe('ActionButtonsCellRenderer', () => {
  it('renders visible actions and calls onClick with the row', async () => {
    const onEdit = vi.fn();
    render(
      <ActionButtonsCellRenderer
        {...buildParams([{ id: 'edit', label: 'Edit', onClick: onEdit }])}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onEdit).toHaveBeenCalledWith(row);
  });

  it('hides actions whose hidden() resolves to true', () => {
    render(
      <ActionButtonsCellRenderer
        {...buildParams([
          { id: 'edit', label: 'Edit', onClick: vi.fn() },
          { id: 'delete', label: 'Delete', hidden: () => true, onClick: vi.fn() },
        ])}
      />,
    );

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('disables actions based on row data (e.g. permission checks)', () => {
    render(
      <ActionButtonsCellRenderer
        {...buildParams([
          {
            id: 'delete',
            label: 'Delete',
            disabled: (r) => !r.canDelete,
            onClick: vi.fn(),
          },
        ])}
      />,
    );

    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
  });
});
