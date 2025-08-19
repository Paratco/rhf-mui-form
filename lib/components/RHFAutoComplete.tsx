import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { AutocompleteProps, TextFieldProps } from "@mui/material";
import { Autocomplete, TextField } from "@mui/material";
import type { ReactElement, ReactNode } from "react";
import { useMemo } from "react";
import type { SelectOptionBase } from "../types";
import { getHelperText } from "../utils";

// Temporary workaround: MUI is deprecating InputProps, and we should use slotProps instead.
// Unfortunately, the library itself still uses InputProps internally.
// So until that's fixed, we have to handle it this way.

interface OptionItem extends SelectOptionBase {
  value: string;
}

type Props<
  T extends FieldValues,
  Value extends OptionItem,
  Multiple extends boolean,
  DisableClearable extends boolean,
  FreeSolo extends boolean
> = Omit<AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo>, "name" | "renderInput" | "multiple"> & {
  readonly name: Path<T>;
  readonly label: ReactNode;
  readonly options: OptionItem[];
  readonly control?: Control<T>;
  readonly inputDir?: "ltr" | "rtl";
  readonly renderInputProps?: Omit<TextFieldProps, "name">;
  readonly multiple?: boolean;
  readonly hasEmptyHelper?: boolean;
  readonly helperText?: ReactNode;
};

export function RHFAutoComplete<
  T extends FieldValues,
  Value extends OptionItem = OptionItem,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
  FreeSolo extends boolean = false
>({
  name,
  label,
  options,
  control,
  inputDir,
  renderInputProps,
  multiple,
  helperText,
  hasEmptyHelper = true,
  disabled,
  ...props
}: Props<T, Value, Multiple, DisableClearable, FreeSolo>): ReactElement {
  const formContext = useFormContext<T>();

  const innerOptions = useMemo(() => {
    const result: Record<string, OptionItem> = {};

    for (const o of options) {
      result[o.value] = o;
    }

    return result;
  }, [options]);

  return (
    <Controller
      name={name}
      control={control ?? formContext.control}
      disabled={disabled}
      render={({ field: { value, onChange, onBlur, ref, ...field }, fieldState: { error } }) => (
        <Autocomplete<Value, Multiple, DisableClearable, FreeSolo>
          fullWidth={true}
          multiple={multiple as Multiple}
          {...props}
          options={options}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          value={
            value !== undefined && value !== null
              ? (
                multiple === true
                  ? (value as string[]).map((v) => innerOptions[v])
                  : innerOptions[value]
              )
              : (multiple === true ? [] : null)
          }
          isOptionEqualToValue={(option, val) => {
            return option.value === val.value;
          }}
          getOptionLabel={(option) => {
            return (option as OptionItem).label;
          }}
          renderInput={(params) => (
            <TextField
              {...renderInputProps}
              {...params}
              inputRef={ref}
              {...field}
              label={label}
              error={field.disabled !== true && error !== undefined}
              // eslint-disable-next-line @typescript-eslint/no-deprecated
              InputProps={{
                ...params.InputProps,
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                ...renderInputProps?.InputProps
              }}
              helperText={
                getHelperText(field.disabled, error?.message, helperText, hasEmptyHelper)
              }
            />
          )}
          onChange={(event, newValue, ...rest) => {
            if (multiple === true) {
              onChange((newValue as OptionItem[]).map((n) => n.value));
            } else {
              onChange(newValue !== null ? (newValue as OptionItem).value : null);
            }

            if (props.onChange !== undefined) {
              props.onChange(event, newValue, ...rest);
            }
          }}
          onBlur={(...p) => {
            onBlur();

            if (props.onBlur !== undefined) {
              props.onBlur(...p);
            }
          }}
        />
      )}
    />
  );
}
