import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import type { ColDef } from 'ag-grid-community';
import { DataTable } from './DataTable';

interface Row {
  id: string;
  name: string;
}

const columnDefs: ColDef<Row>[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Name' },
];

describe('DataTable', () => {
  it('renders row data once loaded', async () => {
    render(
      <DataTable<Row>
        columnDefs={columnDefs}
        rowData={[{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }]}
      />,
    );

    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows the empty overlay only when not loading and rowData is empty', async () => {
    render(<DataTable<Row> columnDefs={columnDefs} rowData={[]} emptyMessage="沒有使用者" />);
    await waitFor(() => expect(screen.getByText('沒有使用者')).toBeInTheDocument());
  });

  it('shows the loading overlay instead of the empty state while loading', () => {
    render(<DataTable<Row> columnDefs={columnDefs} rowData={[]} loading />);
    expect(screen.getByText('載入中…')).toBeInTheDocument();
    expect(screen.queryByText('目前沒有資料')).not.toBeInTheDocument();
  });
});
