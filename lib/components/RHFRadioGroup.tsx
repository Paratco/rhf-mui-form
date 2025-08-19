import type { ReactElement, ReactNode } from "react";
import type { RadioGroupProps, FormLabel } from "@mui/material";
import { FormControl, FormControlLabel, Radio, RadioGroup, FormHelperText } from "@mui/material";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import { getHelperText } from "../utils";

interface OptionItem {
  label: string;
  value: string;
  disabled?: boolean;
}

type Props<T extends FieldValues> = Omit<RadioGroupProps, "name"> & {

  /** The name of the field in the form state */
  readonly name: Path<T>;

  /** An array of options for the radio buttons, each having a label and value */
  readonly options: OptionItem[];

  /** A FormLabel component to be displayed above the radio buttons */
  readonly formLabel?: ReactElement<typeof FormLabel>;

  /** The control object from React Hook Form, optional if useFormContext is used */
  readonly control?: Control<T>;

  /** If `true`, the component is disabled. */
  readonly disabled?: boolean;

  /** Whether the field has an empty helper text */
  readonly hasEmptyHelper?: boolean;

  readonly helperText?: ReactNode;
};

/**
 * `RHFRadioGroup` is a wrapper around MIUI's `RadioGroup` component that integrates with React Hook Form.
 * It renders a group of radio buttons based on the provided options and manages the form state.
 *
 * - The component can either receive the RHF control as a prop or use `useFormContext` to automatically access the form control.
 * - The `formLabel` prop allows for an optional MUI `FormLabel` component to be displayed above the radio buttons.
 *
 * @template T - A generic type for the form's field values, extending `FieldValues`.
 *
 * @param {Path<T>} name - The name of the field in the form state.
 * @param {OptionItem[]} options - An array of options for the radio buttons, each having a label and value.
 * @param {ReactElement<typeof FormLabel>} [formLabel] - A FormLabel component to be displayed above the radio buttons.
 * @param {Control<T>} [control] - The React Hook Form control object. If not provided, the form context will be used.
 * @param {boolean} [disabled] - If `true`, the component is disabled.
 * @param {RadioGroupProps} props - Additional props passed to the underlying MUI `RadioGroup`.
 *
 * @returns {ReactElement} A controlled `RadioGroup` component integrated with React Hook Form.
 *
 * @example
 * ```tsx
 * <RHFRadioGroup
 *   name="gender"
 *   options={[
 *     { label: "Male", value: "male" },
 *     { label: "Female", value: "female" },
 *   ]}
 *   formLabel={<FormLabel>Gender</FormLabel>} // Optional FormLabel
 *   control={control} // Optional, if useFormContext is not used
 * />
 * ```
 *
 * @example
 * ```tsx
 * <RHFRadioGroup
 *   name="subscription"
 *   options={[
 *     { label: "Monthly", value: "monthly" },
 *     { label: "Yearly", value: "yearly" },
 *   ]}
 * />
 * ```
 */
export function RHFRadioGroup<T extends FieldValues>({
  name,
  options,
  formLabel,
  control,
  disabled,
  hasEmptyHelper = true,
  helperText,
  ...props
}: Props<T>): ReactElement {
  const formContext = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control ?? formContext.control}
      disabled={disabled}
      render={({ field: { onChange, onBlur, ...field }, fieldState: { error } }) => (
        <FormControl error={error !== undefined}>
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
