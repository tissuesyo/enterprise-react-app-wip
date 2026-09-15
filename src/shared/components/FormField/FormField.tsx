import { useId, type ReactNode } from 'react';
import { FormHelperText, FormLabel, Stack } from '@mui/material';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
  /** render prop：把產生好的 id 傳給實際的輸入元件（例如 Checkbox Group、Upload），確保 label 與欄位正確關聯。 */
  children: (fieldProps: { id: string; 'aria-describedby': string }) => ReactNode;
}

/**
 * 給「非標準欄位」使用的通用外框：Upload、Checkbox Group、Radio Group、Date Range、自訂選擇器等。
 * FormTextField / FormSelect 已經各自處理好 label/helperText/error 的關聯，不需要再套一層 FormField。
 *
 * 範例：
 *   <FormField label="附件" helperText="限 PDF，最大 10MB">
 *     {(fieldProps) => <MyUploadWidget {...fieldProps} />}
 *   </FormField>
 */
export function FormField({
  label,
  required,
  helperText,
  errorMessage,
  children,
}: FormFieldProps): ReactNode {
  const id = useId();
  const helperId = `${id}-helper`;

  return (
    <Stack spacing={0.5}>
      <FormLabel htmlFor={id} required={required} error={Boolean(errorMessage)}>
        {label}
      </FormLabel>
      {children({ id, 'aria-describedby': helperId })}
      <FormHelperText id={helperId} error={Boolean(errorMessage)}>
        {errorMessage ?? helperText}
      </FormHelperText>
    </Stack>
  );
}
