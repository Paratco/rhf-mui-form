import { Box, IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";
import type { ReactElement, ReactNode, MouseEvent } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import type { ReactMaskOpts } from "react-imask";
import { RHFTextMasked } from "./RHFTextMasked";

interface Props<T extends FieldValues> {
  readonly name: Path<T>;
  readonly maskOptions: ReactMaskOpts;
  readonly control?: Control<T>;
  readonly label: ReactNode;
}

const handleMouseUpPassword = (event: MouseEvent<HTMLButtonElement>): void => {
  event.preventDefault();
};

const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>): void => {
  event.preventDefault();
};

export function RHFPasswordField<T extends FieldValues>({
  name,
  control,
  label,
  maskOptions
}: Props<T>): ReactElement {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = (): void => {
    setIsShowPassword((prev) => !prev);
  };

  const adornment = (
    <InputAdornment position="end">
      <IconButton
        tabIndex={-1}
        onClick={handleClickShowPassword}
        onMouseDown={handleMouseDownPassword}
        onMouseUp={handleMouseUpPassword}
      >
        {isShowPassword
          ? (
            <Box
              component="img"
              src={new URL("../assets/icons/eye-slash.svg", import.meta.url).href}
            />
          )
          : (
            <Box
              component="img"
              src={new URL("../assets/icons/eye.svg", import.meta.url).href}
            />
          )}
      </IconButton>
    </InputAdornment>
  );

  return (
    <RHFTextMasked<T>
      name={name}
      control={control}
      inputDir="ltr"
      label={label}
      type={isShowPassword ? "text" : "password"}
      maskOptions={maskOptions}
      slotProps={{
        input: {
          endAdornment: adornment
        }
      }}
    />
  );
}
