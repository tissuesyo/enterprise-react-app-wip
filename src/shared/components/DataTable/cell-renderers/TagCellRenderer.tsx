import type { ReactNode } from 'react';
import { Chip, Stack, Typography } from '@mui/material';
import type { ChipProps } from '@mui/material';
import type { CustomCellRendererProps } from 'ag-grid-react';

export interface TagCellRendererTag {
  label: string;
  color?: ChipProps['color'];
}

export interface TagCellRendererParams<TData> extends CustomCellRendererProps<TData, unknown> {
  /** 一般文字（跟 tags 同欄顯示在前面），例如「Tissue」。可省略，只顯示 tags。 */
  text?: (row: TData) => string | undefined;
  /** Tag 清單。業務上的顏色/文字 mapping（例如 ACTIVE → 綠色）由 Feature 決定，不寫死在這個共用 Renderer。 */
  tags: (row: TData) => TagCellRendererTag[];
  /** 最多顯示幾個 Tag，超過用 "+N" 表示，預設不限制。 */
  maxTags?: number;
}

/** 顯示「一般文字 + 一個或多個 Tag」的欄位，例如 `Tissue [ACTIVE] [ADMIN]`。 */
export function TagCellRenderer<TData>(params: TagCellRendererParams<TData>): ReactNode {
  const { data, text, tags, maxTags } = params;
  if (!data) return <span aria-hidden="true">—</span>;

  const textValue = text?.(data);
  const allTags = tags(data);

  if (!textValue && allTags.length === 0) {
    return <span aria-hidden="true">—</span>;
  }

  const visibleTags = maxTags ? allTags.slice(0, maxTags) : allTags;
  const hiddenCount = allTags.length - visibleTags.length;

  return (
    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ height: '100%' }}>
      {textValue && <Typography variant="body2">{textValue}</Typography>}
      {visibleTags.map((tag) => (
        <Chip key={tag.label} label={tag.label} size="small" color={tag.color ?? 'default'} />
      ))}
      {hiddenCount > 0 && (
        <Typography variant="caption" color="text.secondary">
          +{hiddenCount}
        </Typography>
      )}
    </Stack>
  );
}
