import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { InputBaseComponentProps, TextFieldProps } from "@mui/material";
import { TextField } from "@mui/material";
import type { ReactElement } from "react";
import { forwardRef } from "react";
import type { ReactMaskOpts } from "react-imask";
import { IMaskInput } from "react-imask";
import { getHelperText } from "../utils";

type Props<T extends FieldValues> = Omit<TextFieldProps, "name"> & {

  /** The name of the field in the form state */
  readonly name: Path<T>;

  /** Masking options for the input, following `react-imask` options */
  readonly maskOptions: ReactMaskOpts;

  /** The control object from React Hook Form, optional if useFormContext is used */
  readonly control?: Control<T>;

  /** Direction of the text input (left-to-right or right-to-left) */
  readonly inputDir?: "ltr" | "rtl";

  /** Whether the field is read-only */
  readonly isReadOnly?: boolean;

  /** Whether the field has an empty helper text */
  readonly hasEmptyHelper?: boolean;
};

interface TextMaskInputProps extends Omit<InputBaseComponentProps, "onChange"> {

  /** The name of the field in the form state */
  readonly name: string;

  /** Masking options for the input */
  readonly maskOptions: ReactMaskOpts;

  /** Change handler for the input field */
  readonly onChange: (event: { target: { name: string; value: string } }) => void;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const TextMaskInput = forwardRef<HTMLInputElement, TextMaskInputProps>(function TextMaskInput(
  props: TextMaskInputProps,
  ref
) {
  const { maskOptions, onChange, ...other } = props;

  return (
    <IMaskInput
      {...maskOptions}
      {...other}
      inputRef={ref}
      onAccept={(value: unknown) => {
        onChange({ target: { name: props.name, value: value as string } });
      }}
    />
  );
});

/**
 * `RHFTextMasked` is a React Hook Form integrated `TextField` component that supports input masking via `react-imask`.
 * This component also provides support for read-only fields and input direction (LTR or RTL).
 * Default value should be an empty string.
 *
 * - It is integrated with `react-hook-form` using `Controller` to manage form state.
 * - It supports custom masking options via the `maskOptions` prop and can handle right-to-left (RTL) or left-to-right (LTR) input direction.
 * - The component allows setting fields as read-only using the `isReadOnly` prop.
 * - You can pass a `control` object or rely on `useFormContext` for form control.
 *
 * @template T - A generic type for the form's field values, extending `FieldValues`.
 *
 * @param {Path<T>} name - The name of the field in the form state.
 * @param {Control<T>} [control] - The React Hook Form control object. If not provided, the form context will be used.
 * @param {ReactMaskOpts} [maskOptions] - The options for input masking, as defined by `react-imask`.
 * @param {"ltr" | "rtl"} [inputDir] - The text direction for the input field, either left-to-right (ltr) or right-to-left (rtl).
 * @param {boolean} [isReadOnly] - If true, the input will be read-only.
 * @param {boolean} [disabled] - If `true`, the component is disabled.
 * @param {TextFieldProps} props - Additional props passed to the underlying MUI `TextField`.
 *
 * @returns {ReactElement} A controlled `TextField` component integrated with React Hook Form and supporting input masking and read-only fields.
 *
 * @example
 * ```tsx
 * <RHFTextMasked
 *   name="phoneNumber"
 *   label="Phone Number"
 *   maskOptions={{ mask: "(000) 000-0000" }}
 *   control={control}
 *   inputDir="ltr"
 *   isReadOnly={true}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <RHFTextMasked
 *   name="creditCard"
 *   label="Credit Card"
 *   maskOptions={{ mask: "0000-0000-0000-0000" }}
 *   inputDir="rtl"
 * />
 * ```
 */
export function RHFTextMasked<T extends FieldValues>({
  name,
  control,
  maskOptions,
  inputDir,
  isReadOnly,
  disabled,
  hasEmptyHelper = true,
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
            getHelperText(field.disabled, error?.message, props.helperText, hasEmptyHelper)
          }
          slotProps={{
            ...props.slotProps,
            input: {
              readOnly: isReadOnly,
              // eslint-disable-next-line @typescript-eslint/no-misused-spread
              ...props.slotProps?.input,
              inputComponent: TextMaskInput,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              inputProps: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                ...props.slotProps?.input?.inputProps,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                style: {
                  direction: inputDir,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  ...props.slotProps?.input?.inputProps?.style
                },
                maskOptions
              }
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
