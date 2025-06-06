import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { CheckboxProps } from "@mui/material";
import { Checkbox, FormControl, FormControlLabel, FormHelperText } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

type Props<T extends FieldValues> = Omit<CheckboxProps, "name"> & {
  /** The name of the field in the form state */
  readonly name: Path<T>;
  /** The label that will appear next to the checkbox */
  readonly label: ReactNode;
  /** The control object from React Hook Form, optional if useFormContext is used */
  readonly control?: Control<T>;
};

/**
 * `RHFCheckBox` is a wrapper around MIUI's `Checkbox` component that integrates with React Hook Form.
 * It manages the checkbox state and error handling, allowing seamless integration into forms.
 *
 * - The component can either receive the RHF control as a prop or use `useFormContext` to automatically access the form control.
 *
 * @template T - A generic type for the form's field values, extending `FieldValues`.
 *
 * @param {Path<T>} name - The name of the field in the form state.
 * @param {string} label - The label for the checkbox.
 * @param {Control<T>} [control] - The React Hook Form control object. If not provided, the form context will be used.
 * @param {CheckboxProps} props - Additional props passed to the underlying MUI `Checkbox`.
 *
 * @returns {ReactElement} A controlled checkbox component integrated with React Hook Form.
 *
 * @example
 * ```tsx
 * <RHFCheckBox
 *   name="termsAndConditions"
 *   label="I agree to the terms and conditions"
 *   control={control} // Optional, if useFormContext is not used
 * />
 * ```
 *
 * @example
 * ```tsx
 * <RHFCheckBox
 *   name="newsletter"
 *   label="Subscribe to newsletter"
 *   color="primary"
 * />
 * ```
 */
export function RHFCheckBox<T extends FieldValues>({ name, label, control, ...props }: Props<T>): ReactElement {
  const formContext = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control ?? formContext.control}
      render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
        <FormControl error={props.disabled !== true && error !== undefined}>
          <FormControlLabel
            control={
              <Checkbox
                {...props}
                {...field}
                checked={value === true}
                onChange={(e) => {
                  onChange(e.target.checked);
                }}
              />
            }
            label={label}
          />
          <FormHelperText>
            {props.disabled !== true && error?.message !== undefined && error.message.length > 0 ? error.message : " "}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}
