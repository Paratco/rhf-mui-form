import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { DateFieldProps } from "@mui/x-date-pickers";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import type { ReactElement } from "react";
import { getHelperText } from "../utils";

type Props<T extends FieldValues> = Omit<DateFieldProps, "name"> & {
  readonly name: Path<T>;
  readonly control?: Control<T>;
  readonly isReadOnly?: boolean;
  readonly hasEmptyHelper?: boolean;
};

export function RHFDateFieldJalali<T extends FieldValues>({
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
          <DateField
            fullWidth={true}
            {...props}
            error={field.disabled !== true && error !== undefined}
            value={value ?? null}
            helperText={
              getHelperText(field.disabled, error?.message, props.helperText, hasEmptyHelper)
            }
            slotProps={{
              ...props.slotProps,
              textField: (ownerState) => {
                const textFieldProps = typeof props.slotProps?.textField === "function"
                  ? props.slotProps.textField(ownerState)
                  : props.slotProps?.textField;

                return {
                  readOnly: isReadOnly,
                  ...textFieldProps
                };
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
        </LocalizationProvider>
      )}
    />
  );
}
