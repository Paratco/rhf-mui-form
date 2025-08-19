import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { SelectProps } from "@mui/material";
import { ListSubheader, Checkbox, MenuItem, FormControl, FormHelperText, InputLabel, Select } from "@mui/material";
import type { ReactElement, ReactNode } from "react";
import { useMemo } from "react";
import type { SelectOptionBase } from "../types";
import { getHelperText } from "../utils";
import SelectRenderValue from "./partials/SelectRenderValue";

interface Category {
  label: string;
  value: string;
}

/**
 * Interface defining the structure of an option item in the select field.
 * @extends SelectOptionBase - Base interface for the select options.
 */
interface OptionItem extends SelectOptionBase {

  /** The value of the option, which is used as the key */
  value: string;
  category?: Category;
}

type Props<T extends FieldValues> = Omit<SelectProps, "name"> & {

  /** The name of the field in the form state */
  readonly name: Path<T>;

  /** An array of option items to be displayed in the select dropdown */
  readonly options: OptionItem[];

  /** The control object from React Hook Form, optional if useFormContext is used */
  readonly control?: Control<T>;

  /** The direction of the text input, either left-to-right (ltr) or right-to-left (rtl) */
  readonly inputDir?: "ltr" | "rtl";

  /** The maximum height of the select input */
  readonly maxHeight?: number;

  /** The maximum height of the dropdown menu */
  readonly dropDownMaxHeight?: number;

  /** If true, the options will be grouped by category */
  readonly categorized?: boolean;

  /** A string representing the label for items that do not belong to any category when categorized is enabled */
  readonly uncategorizedText?: string;

  /** Whether the field has an empty helper text */
  readonly hasEmptyHelper?: boolean;

  readonly helperText?: ReactNode;
};

/**
 * `RHFSelect` is a wrapper around MIUI's `Select` component that integrates with React Hook Form.
 * It supports both single and multiple selections and handles validation and error messages.
 *
 * - This component automatically handles the form control via React Hook Form and provides seamless integration.
 * - The `options` prop allows for dynamic option generation, including support for disabling options.
 *
 * @template T - A generic type for the form's field values, extending `FieldValues`.
 *
 * @param {Path<T>} name - The name of the field in the form state.
 * @param {OptionItem[]} options - An array of option items to be displayed in the select dropdown.
 * @param {Control<T>} [control] - The React Hook Form control object. If not provided, the form context will be used.
 * @param {"ltr" | "rtl"} [inputDir] - The direction of the text input, either left-to-right or right-to-left.
 * @param {number} [maxHeight] - The maximum height of the select input.
 * @param {number} [dropDownMaxHeight] - The maximum height of the dropdown menu.
 * @param {boolean} [disabled] - If `true`, the component is disabled.
 * @param {boolean} [categorized] - If true, the options will be grouped by category.
 * @param {string} [uncategorizedText] - A string representing the label for items that do not belong to any category when categorized is enabled.
 * @param {SelectProps} props - Additional props passed to the underlying MUI `Select`.
 *
 * @returns {ReactElement} A controlled select component integrated with React Hook Form.
 *
 * @example
 * ```tsx
 * <RHFSelect
 *   name="favoriteFruits"
 *   options={[
 *     { label: "Apple", value: "apple" },
 *     { label: "Banana", value: "banana" },
 *     { label: "Cherry", value: "cherry", disabled: true },
 *   ]}
 *   control={control} // Optional, if useFormContext is not used
 * />
 * ```
 *
 * @example
 * ```tsx
 * <RHFSelect
 *   name="selectedColors"
 *   options={[
 *     { label: "Red", value: "red" },
 *     { label: "Green", value: "green" },
 *     { label: "Blue", value: "blue" },
 *   ]}
 *   multiple
 *   inputDir="ltr"
 * />
 * ```
 */
export function RHFSelect<T extends FieldValues>({
  name,
  options,
  control,
  inputDir,
  maxHeight,
  dropDownMaxHeight,
  disabled,
  categorized = false,
  uncategorizedText = "Uncategorized",
  hasEmptyHelper = true,
  helperText,
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
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              value={value === undefined ? (isMultiple ? [] : "") : value}
              MenuProps={{
                ...props.MenuProps,
                slotProps: {
                  ...props.MenuProps?.slotProps,
                  paper: {
                    // eslint-disable-next-line @typescript-eslint/no-misused-spread
                    ...props.MenuProps?.slotProps?.paper,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    style: {
                      maxHeight: dropDownMaxHeight,
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      ...props.MenuProps?.slotProps?.paper?.style
                    }
                  }
                }
              }}
              renderValue={
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
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
                // eslint-disable-next-line unicorn/no-array-reduce
                  .reduce((acc: ReactElement[], [groupValue, groupItems]) => {
                    acc.push(
                      <ListSubheader key={groupValue}>{innerOptions[groupItems[0]].category?.label}</ListSubheader>
                    );
                    // eslint-disable-next-line unicorn/prefer-single-call
                    acc.push(
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
