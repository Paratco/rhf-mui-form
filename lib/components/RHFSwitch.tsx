import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { SwitchProps } from "@mui/material";
import { Switch, FormControl, FormControlLabel, FormHelperText } from "@mui/material";
import type { ReactElement, ReactNode } from "react";
import { getHelperText } from "../utils";

type Props<T extends FieldValues> = Omit<SwitchProps, "name"> & {

  /** The name of the field in the form state */
  readonly name: Path<T>;

  /** The label that will appear next to the switch */
  readonly label: ReactNode;

  /** The control object from React Hook Form, optional if useFormContext is used */
  readonly control?: Control<T>;

  /** Whether the field has an empty helper text */
  readonly hasEmptyHelper?: boolean;

  readonly helperText?: ReactNode;
};

/**
 * `RHFSwitch` is a wrapper around MIUI's `Switch` component that integrates with React Hook Form.
 * It manages the form state for a boolean field and displays an optional label and error message.
 *
 * @template T - A generic type extending `FieldValues`, representing the structure of form fields.
 *
 * @param name - The name of the field in the form state. This is required to connect the `Switch` to the form.
 * @param label - The label that will be displayed alongside the switch.
 * @param control - The control object provided by React Hook Form. If omitted, it uses `useFormContext` to retrieve it.
 * @param {boolean} [disabled] - If `true`, the component is disabled.
 * @param props - Additional props to pass down to the `Switch` component.
 *
 * @returns A `ReactElement` rendering the controlled `Switch` component within a `FormControl` with validation support.
 *
 * @example
 * ```tsx
 * <RHFSwitch
 *   name="notifications"
 *   label="Enable Notifications"
 *   control={control} // Optional, if useFormContext is not used
 * />
 * ```
 *
 * @example
 * ```tsx
 * <RHFSwitch
 *   name="darkMode"
 *   label="Enable Dark Mode"
 *   control={control}
 *   checked={true}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <RHFSwitch
 *   name="termsAccepted"
 *   label="Accept Terms and Conditions"
 *   control={control} // Optional
 * />
 * ```
 */
export function RHFSwitch<T extends FieldValues>({
  name,
  label,
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
      render={({ field: { value, onChange, onBlur, ...field }, fieldState: { error } }) => (
        <FormControl error={field.disabled !== true && error !== undefined}>
          <FormControlLabel
            label={label}
            control={(
              <Switch
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
