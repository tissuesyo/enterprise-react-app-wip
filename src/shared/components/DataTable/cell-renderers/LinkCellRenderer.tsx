import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import type { CustomCellRendererProps } from 'ag-grid-react';

export interface LinkCellRendererParams<TData> extends CustomCellRendererProps<TData, string> {
  /** 站內連結（用 react-router 的 <Link>）。跟 href 擇一使用，不要同時提供，避免導覽行為衝突。 */
  to?: (row: TData) => string;
  /** 站外連結。跟 to 擇一使用。 */
  href?: (row: TData) => string;
  /** 額外的 click callback，例如記錄埋點；不會取代預設的導覽行為。 */
  onLinkClick?: (row: TData) => void;
  /** 站外連結是否開新分頁，預設 true，並自動加上 rel="noopener noreferrer" 避免安全性問題。 */
  openInNewTab?: boolean;
}

/** 顯示可點擊連結：站內用 react-router Link，站外用一般 <a>，兩者互斥以避免衝突的導覽行為。 */
export function LinkCellRenderer<TData>(params: LinkCellRendererParams<TData>): ReactNode {
  const { value, data, to, href, onLinkClick, openInNewTab = true } = params;

  if (value === null || value === undefined || value === '' || !data) {
    return <span aria-hidden="true">—</span>;
  }

  if (import.meta.env.DEV && to && href) {
    // 開發模式下提醒使用者不要同時設定 to 與 href，正式環境不印出以免造成噪音。
    console.warn('[LinkCellRenderer] 請只使用 "to" 或 "href" 其中一個，不要同時提供。');
  }

  const handleClick = (): void => onLinkClick?.(data);

  if (to) {
    return (
      <MuiLink component={RouterLink} to={to(data)} onClick={handleClick}>
        {value}
      </MuiLink>
    );
  }

  if (href) {
    return (
      <MuiLink
        href={href(data)}
        onClick={handleClick}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {value}
      </MuiLink>
    );
  }

  return <span>{value}</span>;
}
