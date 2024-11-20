# RHF Mui Form

  This repository contains a custom form component built using React Hook Form (RHF) and Material-UI (MUI).

  It allows for form-controlled selection of options via React Hook Form's `Controller` component.

## Table of Contents

- [Features](#features)
- [Example](#example)


## Installation
To install, you can use npm or yarn or pnpm:

  ```js
npm install @paratco/rhf-mui-form

yarn add @paratco/rhf-mui-form

pnpm add @paratco/rhf-mui-form
```

## Features

  ### `RHFTextField`

`RHFTextField` is a wrapper around MIUI's `TextField` component that integrates with React Hook Form.

 ```tsx
 <RHFTextField
   name="firstName"
   label="First Name"
   control={control} // Optional, if useFormContext is not used
   inputDir="ltr"
   isReadOnly={true}
 />
  ```
  | Prop         | Type              | Default    | Definition                                                                                              |
  | ------------ | ---------         | -------    | ------------------------------------------------------------------------------------------------------- |
  | name\*       | `Path<T>`         |            | The name of the input                                                                                   |
  | control      | `Control`         |            | The control object from React Hook Form, optional if useFormContext is used                             |
  | inputDir     | (`ltr` or `rtl`)  |            | If we want the direction of the input to be different from the overall direction of the page. This is mostly used by Persian/Arabic/... when they want to input numbers or English content in an input field |
  | isReadOnly   | boolean           |   False    | The `isReadOnly` prop to make the input read-only                                                       |
  | props        | TextFieldProps    |            | Additional props passed to the underlying MUI `TextField`                                               |

  --------------------------------

  ### `RHFTextMasked`

  `RHFTextMasked` is a React Hook Form integrated `TextField` component that supports input masking via `react-imask`.

  ```tsx
  <RHFTextMasked
    name="phoneNumber"
    label="Phone Number"
    maskOptions={{ mask: "(000) 000-0000" }}
    control={control} // Optional, if useFormContext is not used
    inputDir="ltr"
    isReadOnly={true}
  />
  ```

  | Prop           | Type              | Default    | Definition                                                                                              |
  | ------------   | ---------         | -------    | ------------------------------------------------------------------------------------------------------- |
  | name\*         | `Path<T>`         |            | The name of the input                                                                                   |
  | maskOptions\*  | ReactMaskOpts     |            | The options for input masking, as defined by `react-imask                                              | 
  | control        | `Control`         |            | The control object from React Hook Form, optional if useFormContext is used                             |
  | inputDir       | (`ltr` or `rtl`)  |            | If we want the direction of the input to be different from the overall direction of the page. This is mostly used by Persian/Arabic/... when they want to input numbers or English content in an input field |
  | isReadOnly     | boolean           |   False    | The `isReadOnly` prop to make the input read-only                                                       |
  | props          | TextFieldProps    |            | Additional props passed to the underlying MUI `TextField`                                               |
  --------------------------------

  ### `RHFAutoComplete`

  `RHFAutoComplete` is a reusable autocomplete component integrated with React Hook Form.

  - Supports single or multiple option selections based on the `Autocomplete` component.

  ```tsx
  <RHFAutoComplete
    name="category"
    label="Category"
    options={categoryOptions}
    control={control} // Optional, if useFormContext is not used
    multiple // Optional, if you want
  />
  ```
  Types:

  ```ts
  export interface SelectOptionBase {
    label: string;
    value: unknown;
    disabled?: boolean;
  }

  interface OptionItem extends SelectOptionBase {
  value: string;
  }

  ```

  | Prop              | Type                                                              | Default | Definition                                                                    |
  | ----------------- | ----------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------- |
  | name\*            | `Path<T>`                                                         |         | The name of the input                                                         |
  | label\*           | string                                                            |         | The name of the input                                                         |
  | options\*         | OptionItem[ ]                                                     |         | The options to be displayed in the autocomplete dropdown.                     |
  | control           | `Control`                                                         |         | The control object from React Hook Form, optional if useFormContext is used   |
  | renderInputProps  | TextFieldProps                                                    |         | Additional props passed to the underlying MUI `TextField`                     |
  | props             | `AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo>`  |         | Additional props passed to the `Autocomplete` component.                      |
  --------------------------------

  ### `RHFCheckBox`

  `RHFCheckBox` is a wrapper around MIUI's `Checkbox` component that integrates with React Hook Form.

   ```tsx
   <RHFCheckBox
     name="termsAndConditions"
     label="I agree to the terms and conditions"
     control={control} // Optional, if useFormContext is not used
   />
   ```
  | Prop         | Type              | Default    | Definition                                                                            |
  | ------------ | ---------         | -------    | --------------------------------------------------------------------------------------|
  | name\*       | `Path<T>`         |            | The name of the input                                                                 |
  | label\*      | string            |            | The label for the checkbox                                                            |
  | control      | `Control`         |            | The control object from React Hook Form, optional if useFormContext is used           |
  | props        | CheckboxProps     |            | Additional props passed to the underlying MUI `Checkbox`                              |
  --------------------------------

  ### `RHFRadioGroup`

   `RHFRadioGroup` is a wrapper around MIUI's `RadioGroup` component that integrates with React Hook Form.

  - It renders a group of radio buttons based on the provided options and manages the form state.
  - The `formLabel` prop allows for an optional MUI `FormLabel` component to be displayed above the radio buttons.

   ```tsx
    <RHFRadioGroup
      name="gender"
      options={[
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ]}
      formLabel={<FormLabel>Gender</FormLabel>} // Optional FormLabel
      control={control} // Optional, if useFormContext is not used
    />
  ```
  | Prop         | Type                              | Default    | Definition                                                                                              |
  | ------------ | ---------                         | -------    | ------------------------------------------------------------------------------------------------------- |
  | name\*       | `Path<T>`                         |            | The name of the input                                                                                   |
  | options\*    | OptionItem[ ]                     |            | An array of options for the radio buttons, each having a label and value.                               |
  | formLabel    | `ReactElement<typeof FormLabel>`  |            | A FormLabel component to be displayed above the radio buttons                                           |
  | control      | `Control`                         |            | The control object from React Hook Form, optional if useFormContext is used                             |
  | props        | RadioGroupProps                   |            | Additional props passed to the underlying MUI `RadioGroup`                                              |

--------------------------------

  ### `RHFSelect`

   `RHFSelect` is a wrapper around MIUI's `Select` component that integrates with React Hook Form.

   - It supports both single and multiple selections and handles validation and error messages.
   - The `options` prop allows for dynamic option generation, including support for disabling options.

   ```tsx
    <RHFSelect
      name="favoriteFruits"
      options={[
        { label: "Apple", value: "apple" },
        { label: "Banana", value: "banana" },
        { label: "Cherry", value: "cherry", disabled: true },
      ]}
      control={control} // Optional, if useFormContext is not used
      multiple // if you want
    />
  ```

  Types:

  ```ts
    export interface SelectOptionBase {
      label: string;
      value: unknown;
      disabled?: boolean;
    }

    interface OptionItem extends SelectOptionBase {
      /** The value of the option, which is used as the key */
      value: string; // Different between RHFSelect and RHFSelectPro
    }
  ```

  | Prop                | Type              | Default    | Definition                                                                                                |
  | ------------        | ---------         | -------    | -------------------------------------------------------------------------------------------------------   |
  | name\*              | `Path<T>`         |            | The name of the input                                                                                     |
  | options\*           | OptionItem[ ]     |            | An array of option items to be displayed in the select dropdown                                           |
  | inputDir            | (`ltr` or `rtl`)  |            | If we want the direction of the input to be different from the overall direction of the page. This is mostly used by Persian/Arabic/... when they want to input numbers or English content in an input field |
  | control             | `Control`         |            | The control object from React Hook Form, optional if useFormContext is used                               |
  | maxHeight           | number            |            | The maximum height of the select input                                                                    | 
  | dropDownMaxHeight   | number            |            | The maximum height of the dropdown menu                                                                   |
  | props               | SelectProps       |            | Additional props passed to the underlying MUI `Select`                                                    |

--------------------------------

  ### `RHFSelectPro`

  `RHFSelectPro` is a wrapper around MIUI's `Select` component that integrates with React Hook Form.

   ```tsx
    <RHFSelectPro
      name="favoriteFruits"
      options={[
        { label: "Apple", value: "apple" },
        { label: "Banana", value: "banana" },
        { label: "Cherry", value: "cherry", disabled: true },
      ]}
      control={control} // Optional, if useFormContext is not used
      multiple // if you want
    />
  ```
 Types:

  ```ts
    export type NotUndefined = object | string | number | boolean | null | NotUndefined[];  

    export interface SelectOptionBase {
      label: string;
      value: unknown;
      disabled?: boolean;
    }

    interface OptionItem extends SelectOptionBase {
      /** The value of the option, which can be any type */
      value: NotUndefined; // Different between RHFSelect and RHFSelectPro
    }
  ```


  | Prop                | Type              | Default    | Definition                                                                                                |
  | ------------        | ---------         | -------    | -------------------------------------------------------------------------------------------------------   |
  | name\*              | `Path<T>`         |            | The name of the input                                                                                     |
  | options\*           | OptionItem[ ]     |            | An array of option items to be displayed in the select dropdown                                           |
  | inputDir            | (`ltr` or `rtl`)  |            | If we want the direction of the input to be different from the overall direction of the page. This is mostly used by Persian/Arabic/... when they want to input numbers or English content in an input field |
  | control             | `Control`         |            | The control object from React Hook Form, optional if useFormContext is used                               |
  | maxHeight           | number            |            | The maximum height of the select input                                                                    | 
  | dropDownMaxHeight   | number            |            | The maximum height of the dropdown menu                                                                   |
  | props               | SelectProps       |            | Additional props passed to the underlying MUI `Select`                                                    |

    
--------------------------------

  ### `RHFSwitch`

  `RHFSwitch` is a wrapper around MIUI's `Switch` component that integrates with React Hook Form.

   ```tsx
    <RHFSwitch
      name="notifications"
      label="Enable Notifications"
      control={control} // Optional, if useFormContext is not used
    />
  ```
  | Prop         | Type              | Default    | Definition                                                                                              |
  | ------------ | ---------         | -------    | ------------------------------------------------------------------------------------------------------- |
  | name\*       | `Path<T>`         |            | The name of the input                                                                                   |
  | label\*      | string            |            | The label that will be displayed alongside the switch                                                   |
  | control      | `Control`         |            | The control object from React Hook Form, optional if useFormContext is used                             |
  | props        | SwitchProps     |            | Additional props to pass down to the `Switch` component                                                   |

--------------------------------

  ### `RHFDatePickerJalali`

  `RHFDatePickerJalali` is a date picker component integrated with React Hook Form

   ```tsx
    <RHFDatePickerJalali
      name="birthDate"
      label="Birth Date"
      control={control} // Optional if useFormContext is used
      isReadOnly={false}
    />
  ```

  | Prop         | Type                      | Default    | Definition                                                                                              |
  | ------------ | ---------                 | -------    | ------------------------------------------------------------------------------------------------------- |
  | name\*       | `Path<T>`                 |            | The name of the input                                                                                   |
  | control      | `Control`                 |            | The control object from React Hook Form, optional if useFormContext is used                             |
  | isReadOnly   | boolean                   |   False    | The `isReadOnly` prop to make the input read-only                                                       |
  | props        | `DatePickerProps<Date>`   |            | Additional props passed to the underlying MUI `DatePicker`                                              |

--------------------------------

  ### `RHFDateTimePickerJalali`

  `RHFDateTimePickerJalali` is a date and time picker component integrated with React Hook Form.

   ```tsx
    <RHFDateTimePickerJalali
      name="appointmentTime"
      label="Appointment Time"
      control={control} // Optional if useFormContext is used
      isReadOnly={false}
    />
  ```
  | Prop         | Type                          | Default    | Definition                                                                                              |
  | ------------ | ---------                     | -------    | ------------------------------------------------------------------------------------------------------- |
  | name\*       | `Path<T>`                     |            | The name of the input                                                                                   |
  | control      | `Control`                     |            | The control object from React Hook Form, optional if useFormContext is used                             |
  | isReadOnly   | boolean                       |   False    | The `isReadOnly` prop to make the input read-only                                                       |
  | props        | `DateTimePickerProps<Date>`   |            | Additional props passed to the underlying MUI `DateTimePicker`                                          |


  - It allows for customization of the time view using the `renderTimeViewClock`.
  - It uses `AdapterDateFnsJalali` for Jalali (Persian) calendar support.

## Example

Here is an example that demonstrates how to use all components in a controlled manner. In this example, MUI is used throughout.

Additionally, Zod is used for validation.

```tsx
  import { Stack, Button, FormLabel } from "@mui/material";
  import { z } from "zod";
  import { zodResolver } from "@hookform/resolvers/zod";
  import type { SubmitHandler } from "react-hook-form";
  import { useForm } from "react-hook-form";
  import {
    RHFAutoComplete,
    RHFCheckBox,
    RHFDatePickerJalali,
    RHFDateTimePickerJalali,
    RHFRadioGroup,
    RHFSelect,
    RHFSelectPro,
    RHFSwitch,
    RHFTextField,
    RHFTextMasked
  } from "@paratco/rhf-mui-form";

  const schema = z.object({
    movies: z.string().nullable(),
    isMan: z.boolean(),
    // If you don't want to give a specific default value for the date, you should use nullable here and handle it inside refine with superRefine
    birthDate: z.date().nullable(), 
    startDate: z.date().nullable(),
    fav: z.string(),
    uni: z.string(),
    selects: z.array(z.boolean()),
    turn: z.boolean(),
    name: z.string(),
    phoneNumber: z.string()
  });

  type SchemaType = z.infer<typeof schema>;

  export default function Home() {
    const { control, handleSubmit } = useForm<SchemaType>({
      resolver: zodResolver(schema),
      defaultValues: {
        movies: null, // Autocomplete
        isMan: false, // checkbox
        birthDate: null, // date picker
        startDate: null, // date time
        fav: "", // radio group
        uni: "", // select
        selects: [], // multi select
        turn: false, // switch
        name: "", // RHFText
        phoneNumber: "" // Mask
      }
    });

    const onSubmit: SubmitHandler<SchemaType> = (data: SchemaType) => {
      console.log(data);
    };

    return (
      <Stack sx={{ flexGrow: 1, width: 1 }}>
        <Stack margin={2} gap={2} component="form" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
          <RHFAutoComplete<SchemaType>
            control={control}
            name="movies"
            key="movies"
            label="Movies"
            options={[
              { label: "Home Alone", value: "homeAlone" },
              { label: "Inception", value: "inception" }
            ]}
          />
          <RHFCheckBox<SchemaType> name="isMan" control={control} label="Are you man?" key="isMan" />
          <RHFDatePickerJalali<SchemaType>
            name="birthDate"
            control={control}
            key="birthDate"
            label="Birth Date"
            // maxDate={new Date()}
            // minDate={new Date()}
          />
          <RHFDateTimePickerJalali<SchemaType> name="startDate" key="startDate" control={control} label="Start Date" />
          <RHFRadioGroup<SchemaType>
            name="fav"
            key="fav"
            control={control}
            formLabel={<FormLabel sx={{ fontSize: "14px" }}>Favorite</FormLabel>}
            options={[
              { label: "spring", value: "spring" },
              { label: "fall", value: "fall" }
            ]}
          />
          <RHFSelect<SchemaType>
            name="uni"
            key="uni"
            control={control}
            label="University"
            options={[
              { label: "UCL", value: "ucl" },
              { label: "milan", value: "milan" }
            ]}
          />
          <RHFSelectPro<SchemaType>
            name="selects"
            multiple={true}
            control={control}
            label="Selects"
            key="selects"
            options={[
              { label: "No1", value: true },
              { label: "No2", value: false }
            ]}
          />
          <RHFSwitch<SchemaType> name="turn" key="turn" control={control} label="Turn on?" />
          <RHFTextField<SchemaType> name="name" control={control} label="Name" key="name" />
          <RHFTextMasked<SchemaType>
            name="phoneNumber"
            control={control}
            label="phoneNumber"
            key="phoneNumber"
            maskOptions={{ mask: "(000) 000-0000" }}
          />
          <Button type="submit">submit</Button>
        </Stack>
      </Stack>
    );
  }
```
