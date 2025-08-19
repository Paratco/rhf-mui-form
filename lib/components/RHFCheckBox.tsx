import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { CheckboxProps } from "@mui/material";
import { Checkbox, FormControl, FormControlLabel, FormHelperText } from "@mui/material";
import type { ReactElement, ReactNode } from "react";
import { getHelperText } from "../utils";

type Props<T extends FieldValues> = Omit<CheckboxProps, "name"> & {
  readonly name: Path<T>;
  readonly label: ReactNode;
  readonly control?: Control<T>;
  readonly helperText?: ReactNode;
  readonly hasEmptyHelper?: boolean;
};

export function RHFCheckBox<T extends FieldValues>({
  name,
  label,
  control,
  helperText,
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
        <FormControl error={field.disabled !== true && error !== undefined}>
          <FormControlLabel
            label={label}
            control={(
              <Checkbox
                {...props}
                checked={value === true}
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
          <FormHelperText>
            {getHelperText(field.disabled, error?.message, helperText, hasEmptyHelper)}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}
