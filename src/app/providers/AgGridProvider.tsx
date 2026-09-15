import { useState, type ReactNode } from 'react';
import { initAgGrid } from '@/app/config/agGrid';

interface AgGridProviderProps {
  children: ReactNode;
}

/**
 * 在渲染任何 DataTable 之前先完成 module registration / license 設定。
 * 用 useState 的 initializer（只在第一次 render 執行一次）而不是 useEffect，
 * 因為 module 註冊必須在 <AgGridReact> 掛載前就完成，放進 effect 會晚一步。
 */
export function AgGridProvider({ children }: AgGridProviderProps): ReactNode {
  useState(() => {
    initAgGrid();
    return null;
  });
  return children;
}
