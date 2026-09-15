import type { ReactNode } from 'react';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { TextField, type TextFieldProps } from '@mui/material';

export interface FormTextFieldProps<TFieldValues extends FieldValues>
  extends Omit<TextFieldProps, 'name' | 'error' | 'helperText' | 'value' | 'onChange' | 'onBlur'> {
  /** 使用 generic 限制：name 必須是 TFieldValues 中真實存在的欄位，打錯欄位名稱在編譯期就會被抓到。 */
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  helperText?: string;
}

/**
 * 整合 React Hook Form 的文字輸入元件：
 * 負責串接 Controller、顯示驗證錯誤（優先於預設 helperText）。
 * 範例：
 *   <FormTextField name="email" control={control} label="Email" required />
 */
export function FormTextField<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  helperText,
  ...rest
}: FormTextFieldProps<TFieldValues>): ReactNode {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...rest}
          {...field}
          label={label}
          value={field.value ?? ''}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? helperText}
          fullWidth
        />
      )}
    />
  );
}
