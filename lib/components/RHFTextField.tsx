import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { TextFieldProps } from "@mui/material";
import { TextField } from "@mui/material";
import type { ReactElement } from "react";

type Props<T extends FieldValues> = Omit<TextFieldProps, "name"> & {

  /** The name of the field in the form state */
  readonly name: Path<T>;

  /** The control object from React Hook Form, optional if useFormContext is used */
  readonly control?: Control<T>;

  /** Direction of the text input (left-to-right or right-to-left) */
  readonly inputDir?: "ltr" | "rtl";

  /** Whether the field is read-only */
  readonly isReadOnly?: boolean;
};

/**
 * `RHFTextField` is a wrapper around MIUI's `TextField` component that integrates with React Hook Form.
 * It only works with controlled fields in React Hook Form (RHF).
 * Default value should be an empty string.
 *
 * - The component can either receive the RHF control as a prop or use `useFormContext` to automatically access the form control.
 * - It supports optional `inputDir` to set the text direction (`ltr` or `rtl`), and the `isReadOnly` prop to make the input read-only.
 *
 * @template T - A generic type for the form's field values, extending `FieldValues`.
 *
 * @param {Path<T>} name - The name of the field in the form state.
 * @param {Control<T>} [control] - The React Hook Form control object. If not provided, the form context will be used.
 * @param {"ltr" | "rtl"} [inputDir] - The text direction for the input. Can be "ltr" (left-to-right) or "rtl" (right-to-left).
 * @param {boolean} [isReadOnly] - Specifies whether the input is read-only.
 * @param {boolean} [disabled] - If `true`, the component is disabled.
 * @param {TextFieldProps} props - Additional props passed to the underlying MUI `TextField`.
 *
 * @returns {ReactElement} A controlled `TextField` component integrated with React Hook Form.
 *
 * @example
 * ```tsx
 * <RHFTextField
 *   name="firstName"
 *   label="First Name"
 *   control={control} // Optional, if useFormContext is not used
 *   inputDir="ltr"
 *   isReadOnly={false}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <RHFTextField
 *   name="email"
 *   label="Email Address"
 *   isReadOnly
 *   inputDir="rtl"
 * />
 * ```
 */
export function RHFTextField<T extends FieldValues>({
  name,
  control,
  inputDir,
  isReadOnly,
  disabled,
  ...props
}: Props<T>): ReactElement {
  const formContext = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control ?? formContext.control}
      disabled={disabled}
      render={({ field: { value, onChange, onBlur, ...field }, fieldState: { error } }) => (
        <TextField
          fullWidth={true}
          {...props}
          error={field.disabled !== true && error !== undefined}
          value={value ?? ""}
          helperText={
            field.disabled !== true && error?.message !== undefined && error.message.length > 0
              ? error.message
              : (props.helperText !== undefined
                ? props.helperText
                : " ")
          }
          slotProps={{
            ...props.slotProps,
            input: {
              readOnly: isReadOnly,
              // eslint-disable-next-line @typescript-eslint/no-misused-spread
              ...props.slotProps?.input
            },
            htmlInput: {
              // eslint-disable-next-line @typescript-eslint/no-misused-spread
              ...props.slotProps?.htmlInput,
              style: {
                direction: inputDir,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                ...props.slotProps?.htmlInput?.style
              }
            }
          }}
          onChange={(...p) => {
            onChange(...p);

            if (props.onChange !== undefined) {
              props.onChange(...p);
            }
          }}
          onBlur={(...p) => {
            onBlur();

            if (props.onBlur !== undefined) {
              props.onBlur(...p);
            }
          }}
          {...field}
        />
      )}
    />
  );
}
