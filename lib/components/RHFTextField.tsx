import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { TextFieldProps } from "@mui/material";
import { TextField } from "@mui/material";
import type { ReactElement } from "react";
import { getHelperText } from "../utils";

type Props<T extends FieldValues> = Omit<TextFieldProps, "name"> & {
  readonly name: Path<T>;
  readonly control?: Control<T>;
  readonly inputDir?: "ltr" | "rtl";
  readonly isReadOnly?: boolean;
  readonly hasEmptyHelper?: boolean;
};

export function RHFTextField<T extends FieldValues>({
  name,
  control,
  inputDir,
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
            input: (ownerState) => {
              const input = typeof props.slotProps?.input === "function"
                ? props.slotProps.input(ownerState)
                : props.slotProps?.input;

              return {
                readOnly: isReadOnly,
                ...input
              };
            },
            htmlInput: (ownerState) => {
              const htmlInput = typeof props.slotProps?.htmlInput === "function"
                ? props.slotProps.htmlInput(ownerState)
                : props.slotProps?.htmlInput;

              return {
                ...htmlInput,
                style: {
                  direction: inputDir,
                  ...htmlInput?.style
                }
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
      )}
    />
  );
}
