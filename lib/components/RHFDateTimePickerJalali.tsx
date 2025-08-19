import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { DateTimePickerProps } from "@mui/x-date-pickers";
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from "@mui/x-date-pickers";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import type { ReactElement } from "react";
import { getHelperText } from "../utils";

type Props<T extends FieldValues> = Omit<DateTimePickerProps, "name"> & {
  readonly name: Path<T>;
  readonly control?: Control<T>;
  readonly isReadOnly?: boolean;
  readonly hasEmptyHelper?: boolean;
};

export function RHFDateTimePickerJalali<T extends FieldValues>({
  name,
  control,
  isReadOnly,
  hasEmptyHelper = true,
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
        <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
          <DateTimePicker
            {...props}
            value={value ?? null}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock
            }}
            slotProps={{
              ...props.slotProps,
              field: (ownerState) => {
                const fieldProps = typeof props.slotProps?.field === "function"
                  ? props.slotProps.field(ownerState)
                  : props.slotProps?.field;

                return {
                  ...fieldProps,
                  readOnly: isReadOnly,
                  onBlur: (...p) => {
                    onBlur();

                    if (fieldProps?.onBlur !== undefined) {
                      fieldProps.onBlur(...p);
                    }
                  }
                };
              },
              textField: (ownerState) => {
                const textFieldProps = typeof props.slotProps?.textField === "function"
                  ? props.slotProps.textField(ownerState)
                  : props.slotProps?.textField;

                return {
                  ...textFieldProps,
                  error: field.disabled !== true && error !== undefined,
                  helperText: getHelperText(
                    field.disabled,
                    error?.message,
                    textFieldProps?.helperText,
                    hasEmptyHelper
                  )
                };
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
