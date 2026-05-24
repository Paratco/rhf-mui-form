import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { SliderProps } from "@mui/material";
import { FormControl, FormHelperText, FormLabel, Slider } from "@mui/material";
import type { ReactElement, ReactNode } from "react";
import { getHelperText } from "../utils";

type Props<T extends FieldValues> = Omit<SliderProps, "name"> & {
  readonly name: Path<T>;
  readonly label?: ReactNode;
  readonly control?: Control<T>;
  readonly helperText?: ReactNode;
  readonly hasEmptyHelper?: boolean;
  readonly sliderDir?: "ltr" | "rtl";
  readonly disabled?: boolean;
};

export function RHFSlider<T extends FieldValues>({
  name,
  label,
  control,
  helperText,
  hasEmptyHelper = true,
  sliderDir,
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
        <FormControl
          fullWidth={true}
          disabled={field.disabled}
          error={field.disabled !== true && error !== undefined}
          dir={sliderDir}
        >
          {label !== undefined ? <FormLabel>{label}</FormLabel> : null}
          <Slider
            {...props}
            value={value ?? (props.defaultValue) ?? 0}
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
          <FormHelperText>
            {getHelperText(field.disabled, error?.message, helperText, hasEmptyHelper)}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}
