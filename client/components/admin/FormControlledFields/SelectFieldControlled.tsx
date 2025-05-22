import { cn } from "@/utils/cn";
import React, { useEffect, useState } from "react";
import { Controller, useController, Control } from "react-hook-form";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { tailwindColsClasses } from "@/lib/config/tailwind-cols-classes";

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectFieldProps {
  control: Control<any>;
  options: SelectOption[];
  placeholder?: string;
  name: string;
  label?: string;
  onInputChange?: (value: string) => void;
  onChangeValue?: (value: string | number | null | SelectOption) => void;
  disabled?: boolean;
  colSpan?: number;
  AddButton?: React.ReactNode;
  creatable?: boolean;
  handleCreate?: (value: string) => void;
  isClearable?: boolean;
  onObjectChange?: (value: any) => void;
  treatAsObject?: boolean;
}

const SelectFieldControlled: React.FC<SelectFieldProps> = ({
  control,
  options,
  placeholder,
  name,
  label = "",
  onInputChange = () => {},
  onChangeValue = () => {},
  disabled = false,
  colSpan = 6,
  AddButton = null,
  creatable = false,
  handleCreate = () => {},
  isClearable = false,
  onObjectChange = () => {},
  treatAsObject = false,
}) => {
  if (!control) return null;

  const [allOptions, setAllOptions] = useState<SelectOption[]>([]);
  const { fieldState, field } = useController({ name, control });
  const errorMessage = fieldState.error?.message;
  console.log("FIELD VALUE IS : ", field.value);
  // Update local cache whenever options change
  useEffect(() => {
    const updatedOptions = new Set([...allOptions, ...options]);
    setAllOptions(Array.from(updatedOptions));
  }, [options]);

  const commonProps = {
    onInputChange,
    isDisabled: disabled,
    options,
    placeholder,
    onChange: (selectedOption: SelectOption | null) => {
      if (treatAsObject) {
        field.onChange(selectedOption);
        onChangeValue(selectedOption);
      } else {
        const value = selectedOption ? selectedOption.value : "";
        field.onChange(value);
        onChangeValue(value);
      }
      onObjectChange(selectedOption);
    },

    value: treatAsObject
      ? field.value
      : allOptions.find((option) => option.value === field.value) || null,
    menuPortalTarget: typeof window !== "undefined" ? document.body : null,

    styles: customStyles,
    getOptionLabel: (option: SelectOption) => option.label,
    getOptionValue: (option: SelectOption) => option.value?.toString(),
  };

  return (
    <div className={`${tailwindColsClasses[colSpan]} w-full`}>
      <div className="mb-5">
        <Controller
          control={control}
          name={name}
          render={() => (
            <div className="relative">
              {label && (
                <label className="block text-sm font-medium text-gray-700 ">
                  {label}
                </label>
              )}
              <div className="mt-1 flex justify-between items-center">
                <div className="w-full mr-2">
                  {creatable ? (
                    <CreatableSelect
                      isClearable={isClearable}
                      {...commonProps}
                      onCreateOption={handleCreate}
                      classNames={{
                        container: () => " rounded-md cursor-pointer  ",
                        control: () =>
                          cn(
                            "cursor-pointer border  !rounded-md !shadow-sm",
                            errorMessage ? "!border-red/50" : "!border-gray-300"
                          ),
                        input: () => "!py-1.5",
                        dropdownIndicator: () => "cursor-pointer",
                        menuPortal: () => "cursor-pointer",
                      }}
                    />
                  ) : (
                    <Select
                      isClearable={isClearable}
                      {...commonProps}
                      classNames={{
                        container: () => " rounded-md cursor-pointer  ",
                        control: () =>
                          cn(
                            "cursor-pointer border  !rounded-md !shadow-sm",
                            errorMessage ? "!border-red/50" : "!border-gray-300"
                          ),
                        input: () => "!py-1.5",
                        dropdownIndicator: () => "cursor-pointer",
                        menuPortal: () => "cursor-pointer",
                      }}
                    />
                  )}
                </div>
                {AddButton && <div className="ml-2">{AddButton}</div>}
              </div>
              <div className="absolute -bottom-5">
                {errorMessage && (
                  <p className=" text-red text-sm mt-1">{errorMessage}</p>
                )}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

const customStyles = {
  menuPortal: (provided: any) => ({
    ...provided,
    zIndex: 9999,
  }),
};

export default SelectFieldControlled;
