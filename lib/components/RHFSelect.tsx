import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { SelectProps } from "@mui/material";
import {
  ListSubheader,
  Checkbox,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Select
} from "@mui/material";
import type { ReactElement, ReactNode } from "react";
import { useMemo } from "react";
import type { SelectOptionBase } from "../types";
import { getHelperText } from "../utils";
import SelectRenderValue from "./partials/SelectRenderValue";

interface Category {
  label: string;
  value: string;
}

interface OptionItem extends SelectOptionBase {
  value: string;
  category?: Category;
}

type Props<T extends FieldValues> = Omit<SelectProps, "name"> & {
  readonly name: Path<T>;
  readonly options: OptionItem[];
  readonly control?: Control<T>;
  readonly inputDir?: "ltr" | "rtl";
  readonly maxHeight?: number;
  readonly dropDownMaxHeight?: number;
  readonly categorized?: boolean;
  readonly uncategorizedText?: string;
  readonly helperText?: ReactNode;
  readonly hasEmptyHelper?: boolean;
};

export function RHFSelect<T extends FieldValues>({
  name,
  options,
  control,
  inputDir,
  maxHeight,
  dropDownMaxHeight,
  categorized = false,
  uncategorizedText = "Uncategorized",
  helperText,
  hasEmptyHelper = true,
  disabled,
  ...props
}: Props<T>): ReactElement {
  const formContext = useFormContext<T>();

  const isMultiple = props.multiple === true;

  const innerOptions = useMemo(() => {
    const result: Record<string, OptionItem> = {};

    for (const o of options) {
      if (o.value in result) {
        console.warn("Duplicate option value for select component:", o.value);
      }

      result[o.value] = o;
    }

    return result;
  }, [options]);

  /** Group options by category */
  const groupedOptions = useMemo(() => {
    if (!categorized) {
      return null;
    }

    const categories: Record<string, string[]> = {};
    const uncategorized: string[] = [];

    for (const option of options) {
      if (option.category === undefined) {
        uncategorized.push(option.value);
        continue;
      }

      if (option.category.value in categories) {
        categories[option.category.value].push(option.value);
      } else {
        categories[option.category.value] = [option.value];
      }
    }

    return { categories, uncategorized };
  }, [categorized, options]);

  return (
    <Controller
      name={name}
      control={control ?? formContext.control}
      disabled={disabled}
      render={({ field: { value, onChange, onBlur, ...field }, fieldState: { error } }) => {
        return (
          <FormControl
            fullWidth={true}
            disabled={field.disabled}
            error={field.disabled !== true && error !== undefined}
          >
            <InputLabel>{props.label}</InputLabel>
            <Select
              {...props}
              error={field.disabled !== true && error !== undefined}
              value={value === undefined ? (isMultiple ? [] : "") : value}
              MenuProps={{
                ...props.MenuProps,
                slotProps: {
                  ...props.MenuProps?.slotProps,
                  paper: (ownerState) => {
                    const paper = typeof props.MenuProps?.slotProps?.paper === "function"
                      ? props.MenuProps.slotProps.paper(ownerState)
                      : props.MenuProps?.slotProps?.paper;

                    return {
                      ...paper,
                      style: {
                        maxHeight: dropDownMaxHeight,
                        ...paper?.style
                      }
                    };
                  }
                }
              }}
              renderValue={
                props.renderValue !== undefined
                  ? props.renderValue
                  : (isMultiple
                    ? (s) => (
                      <SelectRenderValue
                        options={innerOptions}
                        selected={s as string[]}
                        maxHeight={maxHeight}
                        inputDir={inputDir}
                      />
                    )
                    : undefined)
              }
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
              {categorized && groupedOptions !== null
                ? Object.entries(groupedOptions.categories)
                  .reduce((acc: ReactElement[], [groupValue, groupItems]) => {
                    acc.push(
                      <ListSubheader key={groupValue}>{innerOptions[groupItems[0]].category?.label}</ListSubheader>,
                      ...groupItems.map((gItem) => (
                        <MenuItem value={gItem} key={gItem} disabled={innerOptions[gItem].disabled} dir={inputDir}>
                          <Checkbox checked={(value as string[]).includes(gItem)} />
                          {innerOptions[gItem].label}
                        </MenuItem>
                      ))
                    );

                    return acc;
                  }, [])
                  .concat(
                    groupedOptions.uncategorized.length > 0
                      ? (
                        <ListSubheader key="rhf-uncategorized">{uncategorizedText}</ListSubheader>
                      )
                      : (
                        []
                      )
                  )
                  .concat(
                    groupedOptions.uncategorized.map((gItem) => (
                      <MenuItem value={gItem} key={gItem} disabled={innerOptions[gItem].disabled} dir={inputDir}>
                        <Checkbox checked={(value as string[]).includes(gItem)} />
                        {innerOptions[gItem].label}
                      </MenuItem>
                    ))
                  )
                : Object.entries(innerOptions).map(([hash, option]) => (
                  <MenuItem value={hash} key={hash} disabled={option.disabled} dir={inputDir}>
                    {isMultiple ? <Checkbox checked={(value as string[]).includes(hash)} /> : null}
                    {option.label}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText>
              {getHelperText(field.disabled, error?.message, helperText, hasEmptyHelper)}
            </FormHelperText>
          </FormControl>
        );
      }}
    />
  );
}
