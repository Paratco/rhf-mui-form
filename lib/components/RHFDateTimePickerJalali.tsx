import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { DateTimePickerProps } from "@mui/x-date-pickers";
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from "@mui/x-date-pickers";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import type { ReactElement } from "react";

type Props<T extends FieldValues> = Omit<DateTimePickerProps, "name"> & {
  /** The name of the field in the form state */
  readonly name: Path<T>;
  /** The control object from React Hook Form, optional if useFormContext is used */
  readonly control?: Control<T>;
  /** Whether the field is read-only */
  readonly isReadOnly?: boolean;
};

/**
 * `RHFDateTimePickerJalali` is a date and time picker component integrated with React Hook Form
 * using the Jalali calendar system. It wraps MIUI's `DateTimePicker` component to provide a unified
 * experience for working with date and time selection.
 *
 * - It uses `AdapterDateFnsJalali` for Jalali (Persian) calendar support.
 * - The component supports both controlled and uncontrolled forms with React Hook Form.
 * - It allows for customization of the time view using the `renderTimeViewClock`.
 * - You can pass a `control` object or use `useFormContext` to access the form control automatically.
 * - It supports a `readOnly` mode and handles validation errors automatically.
 *
 * @template T - A generic type for the form's field values, extending `FieldValues`.
 *
 * @param {Path<T>} name - The name of the field in the form state.
 * @param {Control<T>} [control] - The React Hook Form control object. If not provided, the form context will be used.
 * @param {boolean} [isReadOnly] - Specifies whether the input is read-only.
 * @param {DateTimePickerProps} props - Additional props passed to the underlying MUI `DateTimePicker`.
 *
 * @returns {ReactElement} A controlled `DateTimePicker` component with Jalali calendar integration and React Hook Form support.
 *
 * @example
 * ```tsx
 * <RHFDateTimePickerJalali
 *   name="appointmentTime"
 *   label="Appointment Time"
 *   control={control} // Optional if useFormContext is used
 *   isReadOnly={false}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <RHFDateTimePickerJalali
 *   name="eventDate"
 *   label="Event Date"
 *   isReadOnly
 * />
 * ```
 */
export function RHFDateTimePickerJalali<T extends FieldValues>({
  name,
  control,
  isReadOnly,
  ...props
}: Props<T>): ReactElement {
  const formContext = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control ?? formContext.control}
      render={({ field: { value, ...field }, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
          <DateTimePicker
            {...props}
            // eslint-disable-next-line @typescript-eslint/no-misused-spread
            sx={{ width: "100%", ...props.sx }}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock
            }}
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
                error: props.disabled !== true && error !== undefined,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                helperText:
                  props.disabled !== true && error?.message !== undefined && error.message.length > 0
                    ? error.message
                    : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      props.slotProps?.textField?.helperText !== undefined
                      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        props.slotProps.textField.helperText
                      : " "
              }
            }}
            value={value ?? null}
            {...field}
          />
        </LocalizationProvider>
      )}
    />
  );
}
