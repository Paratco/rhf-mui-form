// import type { Control, FieldValues, Path } from "react-hook-form";
// import { useWatch, Controller, useFormContext } from "react-hook-form";
// import type { SelectProps } from "@mui/material";
// import { Checkbox, MenuItem, FormControl, FormHelperText, InputLabel, Select } from "@mui/material";
// import type { ReactElement } from "react";
// import { useMemo } from "react";
// import { sha1 } from "object-hash";
// import type { NotUndefined, SelectOptionBase } from "../types";
// import SelectRenderValue from "./partials/SelectRenderValue";
//
// type Props<T extends FieldValues> = Omit<SelectProps, "name"> & {
//
//   readonly name: Path<T>;
//
//   readonly options: OptionItem[];
//
//   readonly control?: Control<T>;
//
//   readonly inputDir?: "ltr" | "rtl";
//
//   readonly maxHeight?: number;
//
//   readonly dropDownMaxHeight?: number;
// };
//
// export function RHFSelectPro<T extends FieldValues>({
//   name,
//   options,
//   control,
//   inputDir,
//   maxHeight,
//   dropDownMaxHeight,
//   ...props
// }: Props<T>): ReactElement {
//   const formContext = useFormContext<T>();
//   const rhfValue: string | string[] | undefined = useWatch({ control: control ?? formContext.control, name });
//
//   const isMultiple = useMemo(() => {
//     return props.multiple === true;
//   }, [props.multiple]);
//
//   const hashedOptions = useMemo(() => {
//     const result: Record<string, OptionItem> = {};
//
//     for (const o of options) {
//       const h = sha1(o.value);
//
//       if (h in result) {
//         console.warn("Duplicate option value for select component:", o.value);
//       }
//
//       result[h] = o;
//     }
//
//     return result;
//   }, [options]);
//
//   const hashedValue: string | string[] = useMemo(() => {
//     if (rhfValue === undefined) {
//       return isMultiple ? [] : "";
//     }
//
//     return isMultiple ? (rhfValue as string[]).map((s) => sha1(s)) : sha1(rhfValue);
//   }, [isMultiple, rhfValue]);
//
//   return (
//     <Controller
//       name={name}
//       control={control ?? formContext.control}
//       render={({ field: { value: _, onChange, ...field }, fieldState: { error } }) => {
//         return (
//           <FormControl
//             fullWidth={true}
//             disabled={props.disabled}
//             error={props.disabled !== true && error !== undefined}
//           >
//             <InputLabel>{props.label}</InputLabel>
//             <Select
//               {...props}
//               error={props.disabled !== true && error !== undefined}
//               value={hashedValue}
//               {...field}
//               MenuProps={{
//                 ...props.MenuProps,
//                 slotProps: {
//                   ...props.MenuProps?.slotProps,
//                   paper: {
//                     ...props.MenuProps?.slotProps?.paper,
//                     style: {
//                       maxHeight: dropDownMaxHeight,
//                       ...props.MenuProps?.slotProps?.paper?.style
//                     }
//                   }
//                 }
//               }}
//               renderValue={
//                 props.renderValue !== undefined
//                   ? props.renderValue
//                   : (isMultiple
//                     ? (s) => (
//                       <SelectRenderValue
//                         options={hashedOptions}
//                         selected={s as string[]}
//                         maxHeight={maxHeight}
//                         inputDir={inputDir}
//                       />
//                     )
//                     : undefined)
//               }
//               onChange={(event) => {
//                 onChange(
//                   isMultiple
//                     ? (event.target.value as string[]).map((v) => hashedOptions[v].value)
//                     : hashedOptions[event.target.value as string].value
//                 );
//               }}
//             >
//               {isMultiple
//                 ? Object.entries(hashedOptions).map(([hash, option]) => (
//                   <MenuItem value={hash} key={hash} disabled={option.disabled} dir={inputDir}>
//                     <Checkbox checked={hashedValue.includes(hash)} />
//                     {option.label}
//                   </MenuItem>
//                 ))
//                 : Object.entries(hashedOptions).map(([hash, option]) => (
//                   <MenuItem value={hash} key={hash} disabled={option.disabled} dir={inputDir}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//             </Select>
//             <FormHelperText>
//               {props.disabled !== true && error?.message !== undefined && error.message.length > 0
//                 ? error.message
//                 : " "}
//             </FormHelperText>
//           </FormControl>
//         );
//       }}
//     />
//   );
// }
