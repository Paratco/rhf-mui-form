import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { AutocompleteProps, TextFieldProps } from "@mui/material";
import { Autocomplete, TextField } from "@mui/material";
import type { ReactElement, ReactNode } from "react";
import { useMemo } from "react";
import type { SelectOptionBase } from "../types";

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

  /** The name of the field in the form state */
  readonly name: Path<T>;

  /** The label for the input field, which will be displayed as a floating label. */
  readonly label: ReactNode;

  /** The options to be displayed in the autocomplete dropdown. */
  readonly options: OptionItem[];

  /** The control object from React Hook Form, optional if useFormContext is used */
  readonly control?: Control<T>;

  /** Optional: Props to be passed to the underlying `TextField` component used in the `renderInput` function. */
  readonly renderInputProps?: Omit<TextFieldProps, "name">;

  /** Optional: To support single or multiple selections */
  readonly multiple?: boolean;
};

/**
 * `RHFAutoComplete` is a reusable autocomplete component integrated with React Hook Form.
 * It allows for form-controlled selection of options via React Hook Form's `Controller` component.
 *
 * - Supports single or multiple option selections based on the `Autocomplete` component.
 * - Handles various input props such as `inputDir`, dropdown height, and form validation.
 * - Uses `useMemo` to optimize the rendering of option values in the dropdown.
 *
 * @template T - A generic type for the form's field values, extending `FieldValues`.
 * @template Value - A generic type for the selected value in the autocomplete, defaults to `OptionItem`.
 * @template Multiple - A boolean type to handle multiple selections.
 * @template DisableClearable - A boolean to disable the clear button.
 * @template FreeSolo - A boolean to allow free-form input text.
 *
 * @param {Path<T>} name - The name of the field in the form state.
 * @param {string} label - The label to be displayed for the input field.
 * @param {OptionItem[]} options - The list of options to be shown in the autocomplete dropdown.
 * @param {Control<T>} [control] - The React Hook Form control object. If not provided, `useFormContext` is used to access the form control.
 * @param {TextFieldProps} [renderInputProps] - Additional props to pass to the underlying MUI `TextField`.
 * @param {boolean} [multiple] - To support single or multiple selections.
 * @param {AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo>} props - Additional props passed to the `Autocomplete` component.
 *
 * @returns {ReactElement} A controlled `Autocomplete` component integrated with React Hook Form.
 *
 * @example
 * ```tsx
 * <RHFAutoComplete
 *   name="category"
 *   label="Category"
 *   options={categoryOptions}
 *   control={control}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <RHFAutoComplete
 *   name="tags"
 *   label="Tags"
 *   options={tagOptions}
 *   control={control}
 *   multiple
 * />
 * ```
 */
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
  renderInputProps,
  multiple,
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
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <Autocomplete<Value, Multiple, DisableClearable, FreeSolo>
          fullWidth={true}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          multiple={multiple}
          {...props}
          getOptionLabel={(option) => (option as OptionItem).label}
          options={options}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          value={
            value !== undefined && value !== null
              ? (multiple === true
                ? (value as string[]).map((v) => innerOptions[v])
                : innerOptions[value])
              : (multiple === true
                ? []
                : null)
          }
          isOptionEqualToValue={(option, val) => {
            return option.value === val.value;
          }}
          renderInput={(params) => (
            <TextField
              {...renderInputProps}
              {...params}
              label={label}
              inputRef={ref}
              error={props.disabled !== true && error !== undefined}
              // eslint-disable-next-line @typescript-eslint/no-deprecated
              InputProps={{
                ...params.InputProps,
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                ...renderInputProps?.InputProps
              }}
              helperText={
                props.disabled !== true && error?.message !== undefined && error.message.length > 0
                  ? error.message
                  : (renderInputProps?.helperText !== undefined
                    ? renderInputProps.helperText
                    : " ")
              }
            />
          )}
          onChange={(_, newValue) => {
            if (multiple === true) {
              onChange((newValue as OptionItem[]).map((n) => n.value));
            } else {
              onChange(newValue !== null ? (newValue as OptionItem).value : null);
            }
          }}
        />
      )}
    />
  );
}
