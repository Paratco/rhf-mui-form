import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { InputBaseComponentProps, TextFieldProps } from "@mui/material";
import { TextField } from "@mui/material";
import type { FunctionComponent, ReactElement, RefObject } from "react";
import type { ReactMaskOpts } from "react-imask";
import { IMaskInput } from "react-imask";
import { getHelperText } from "../utils";

type Props<T extends FieldValues> = Omit<TextFieldProps, "name"> & {
  readonly name: Path<T>;
  readonly maskOptions: ReactMaskOpts;
  readonly control?: Control<T>;
  readonly inputDir?: "ltr" | "rtl";
  readonly isReadOnly?: boolean;
  readonly hasEmptyHelper?: boolean;
};

interface TextMaskInputProps extends Omit<InputBaseComponentProps, "onChange"> {
  readonly name: string;
  readonly maskOptions: ReactMaskOpts;
  readonly onChange: (event: { target: { name: string; value: string } }) => void;
  readonly ref?: RefObject<HTMLInputElement>;
}

function TextMaskInput(props: TextMaskInputProps): ReactElement {
  const { maskOptions, onChange, name, ref, ...other } = props;

  return (
    <IMaskInput
      {...maskOptions}
      {...other}
      inputRef={ref}
      onAccept={(value: unknown) => {
        onChange({ target: { name: name, value: value as string } });
      }}
    />
  );
}

export function RHFTextMasked<T extends FieldValues>({
  name,
  control,
  maskOptions,
  inputDir,
  isReadOnly,
  disabled,
  hasEmptyHelper = true,
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
                ...input,
                inputComponent: TextMaskInput as unknown as FunctionComponent<InputBaseComponentProps>,
                inputProps: {
                  ...input?.inputProps,
                  style: {
                    direction: inputDir,
                    ...input?.inputProps?.style
                  }
                }
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
