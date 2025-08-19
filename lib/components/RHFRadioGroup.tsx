import type { ReactElement, ReactNode } from "react";
import type { RadioGroupProps, FormLabel } from "@mui/material";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormHelperText
} from "@mui/material";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import { getHelperText } from "../utils";

interface OptionItem {
  label: string;
  value: string;
  disabled?: boolean;
}

type Props<T extends FieldValues> = Omit<RadioGroupProps, "name"> & {
  readonly name: Path<T>;
  readonly options: OptionItem[];
  readonly formLabel?: ReactElement<typeof FormLabel>;
  readonly control?: Control<T>;
  readonly helperText?: ReactNode;
  readonly hasEmptyHelper?: boolean;
  readonly disabled?: boolean;
};

export function RHFRadioGroup<T extends FieldValues>({
  name,
  options,
  formLabel,
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
      render={({ field: { onChange, onBlur, ...field }, fieldState: { error } }) => (
        <FormControl error={field.disabled !== true && error !== undefined}>
          {formLabel ?? null}
          <RadioGroup
            {...props}
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
          >
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
                disabled={(field.disabled === true) || option.disabled}
              />
            ))}
          </RadioGroup>
          <FormHelperText>
            {getHelperText(field.disabled, error?.message, helperText, hasEmptyHelper)}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}
