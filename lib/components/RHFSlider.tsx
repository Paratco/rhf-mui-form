import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { SliderProps } from "@mui/material";
import { FormControl, FormHelperText, FormLabel, Slider } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

function getHelperText(
  disabled: boolean | undefined,
  error: string | undefined,
  helperText: ReactNode | undefined,
  hasEmptyHelper: boolean | undefined
): ReactNode | string | undefined {
  if (disabled === true) {
    return hasEmptyHelper === true ? " " : undefined;
  }

  if (error !== undefined && error.length > 0) {
    return error;
  }

  if (helperText !== undefined) {
    return helperText;
  }

  return hasEmptyHelper === true ? " " : undefined;
}

type Props<T extends FieldValues> = Omit<SliderProps, "name"> & {
  readonly name: Path<T>;
  readonly label?: ReactNode;
  readonly control?: Control<T>;
  readonly helperText?: ReactNode;
  readonly hasEmptyHelper?: boolean;
  readonly sliderDir?: "ltr" | "rtl";
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
            value={value ?? props.min ?? 0}
            onChange={(event, newValue, activeThumb) => {
              onChange(newValue);

              if (props.onChange !== undefined) {
                props.onChange(event, newValue, activeThumb);
              }
            }}
            onBlur={(event) => {
              onBlur();

              if (props.onBlur !== undefined) {
                props.onBlur(event);
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
