import type { ReactNode } from 'react';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectProps,
} from '@mui/material';

export interface FormSelectOption<TValue extends string | number> {
  value: TValue;
  label: string;
}

export interface FormSelectProps<
  TFieldValues extends FieldValues,
  TValue extends string | number,
> extends Omit<SelectProps, 'name' | 'error' | 'value' | 'onChange' | 'onBlur'> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  options: readonly FormSelectOption<TValue>[];
  helperText?: string;
  required?: boolean;
}

/**
 * 整合 React Hook Form 的下拉選單元件。
 * Options 使用明確的 `{ value, label }` 型別，避免直接丟一組 string[] 導致顯示文字跟送出值混淆。
 */
export function FormSelect<TFieldValues extends FieldValues, TValue extends string | number>({
  name,
  control,
  label,
  options,
  helperText,
  required,
  ...rest
}: FormSelectProps<TFieldValues, TValue>): ReactNode {
  const labelId = `${name}-label`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl fullWidth error={Boolean(fieldState.error)} required={required}>
          <InputLabel id={labelId}>{label}</InputLabel>
          <Select
            {...rest}
            {...field}
            value={field.value ?? ''}
            labelId={labelId}
            label={label}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{fieldState.error?.message ?? helperText}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
