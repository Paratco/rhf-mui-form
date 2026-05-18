import { Box, IconButton, InputAdornment, Stack } from "@mui/material";
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

export default function RHFPasswordField<T extends FieldValues>({
  name,
  control,
  label,
  maskOptions
}: Props<T>): ReactElement {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = (): void => {
    setShowPassword((prev) => !prev);
  };

  const adornment = (
    <InputAdornment position="end">
      <IconButton
        tabIndex={-1}
        onClick={handleClickShowPassword}
        onMouseDown={handleMouseDownPassword}
        onMouseUp={handleMouseUpPassword}
      >
        {showPassword
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
    <Stack sx={{ position: "relative" }}>
      <RHFTextMasked<T>
        name={name}
        control={control}
        inputDir="ltr"
        label={label}
        type={showPassword ? "text" : "password"}
        maskOptions={maskOptions}
        slotProps={{
          input: {
            endAdornment: adornment
          }
        }}
      />
    </Stack>
  );
}
