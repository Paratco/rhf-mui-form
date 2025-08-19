import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { DatePickerProps } from "@mui/x-date-pickers";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import type { ReactElement } from "react";
import { getHelperText } from "../utils";

type Props<T extends FieldValues> = Omit<DatePickerProps, "name"> & {

  /** The name of the field in the form state */
  readonly name: Path<T>;

  /** The control object from React Hook Form, optional if useFormContext is used */
  readonly control?: Control<T>;

  /** Whether the field is read-only */
  readonly isReadOnly?: boolean;

  /** Whether the field has an empty helper text */
  readonly hasEmptyHelper?: boolean;
};

/**
 * `RHFDatePickerJalali` is a date picker component integrated with React Hook Form
 * using the Jalali calendar system. It wraps MIUI's `DatePicker` component and provides
 * seamless integration with React Hook Form.
 *
 * - The component allows you to select dates in the Jalali calendar format using the `AdapterDateFnsJalali` adapter.
 * - It works with both controlled and uncontrolled forms using React Hook Form.
 * - You can pass a `control` object or use `useFormContext` to access the form control automatically.
 * - It supports a `readOnly` mode and displays validation errors automatically.
 *
 * @template T - A generic type for the form's field values, extending `FieldValues`.
 *
 * @param {Path<T>} name - The name of the field in the form state.
 * @param {Control<T>} [control] - The React Hook Form control object. If not provided, the form context will be used.
 * @param {boolean} [isReadOnly] - Specifies whether the input is read-only.
 * @param {boolean} [disabled] - If `true`, the component is disabled.
 * @param {DatePickerProps} props - Additional props passed to the underlying MUI `DatePicker`.
 *
 * @returns {ReactElement} A controlled `DatePicker` component with Jalali calendar integration and React Hook Form support.
 *
 * @example
 * ```tsx
 * <RHFDatePickerJalali
 *   name="birthDate"
 *   label="Birth Date"
 *   control={control} // Optional if useFormContext is used
 *   isReadOnly={false}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <RHFDatePickerJalali
 *   name="startDate"
 *   label="Start Date"
 *   isReadOnly
 * />
 * ```
 */
export function RHFDatePickerJalali<T extends FieldValues>({
  name,
  control,
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
      render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
          <DatePicker
            {...props}
            // eslint-disable-next-line @typescript-eslint/no-misused-spread
            sx={{ width: "100%", ...props.sx }}
            value={value ?? null}
            slotProps={{
              ...props.slotProps,
              field: {
                // eslint-disable-next-line @typescript-eslint/no-misused-spread
                ...props.slotProps?.field,
                readOnly: isReadOnly
              },
              textField: {
                // eslint-disable-next-line @typescript-eslint/no-misused-spread
                ...props.slotProps?.textField,
                error: field.disabled !== true && error !== undefined,

                helperText:
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  getHelperText(field.disabled, error?.message, props.slotProps?.textField?.helperText, hasEmptyHelper)
              }
            }}
            onChange={(...p) => {
              onChange(...p);

              if (props.onChange !== undefined) {
                props.onChange(...p);
              }
            }}
            {...field}
          />
        </LocalizationProvider>
      )}
    />
  );
}
