import type { ReactElement } from "react";
import { memo } from "react";
import { Chip, Stack } from "@mui/material";
import type { SelectOptionBase } from "../../types";

interface Props {
  readonly options: Record<string, SelectOptionBase>;
  readonly selected: string[];
  readonly maxHeight: number | undefined;
  readonly inputDir: "ltr" | "rtl" | undefined;
}

interface ChipsProps {
  readonly options: Props["options"];
  readonly selected: Props["selected"];
}

function Chips({ options, selected }: ChipsProps): ReactElement | ReactElement[] {
  return selected.map((s) => {
    return <Chip key={s} label={options[s].label} size="small" />;
  });
}

function SelectRenderValue({ options, selected, maxHeight, inputDir }: Props): ReactElement {
  if (maxHeight === undefined) {
    return (
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Chips options={options} selected={selected} />
      </Stack>
    );
  }

  return (
    <Stack dir="ltr" maxHeight={maxHeight} sx={{ overflowY: "auto" }}>
      <Stack dir={inputDir} direction="row" flexWrap="wrap" gap={1}>
        <Chips options={options} selected={selected} />
      </Stack>
    </Stack>
  );
}

export default memo(SelectRenderValue);
