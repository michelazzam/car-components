import { tailwindColsClasses } from "@/lib/config/tailwind-cols-classes";
import { cn } from "@/utils/cn";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectFieldProps {
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  onInputChange?: (value: string) => void;
  onChangeValue?: (value: SelectOption | null) => void;
  value?: SelectOption | null;
  disabled?: boolean;
  colSpan?: number;
  AddButton?: React.ReactNode;
  creatable?: boolean;
  handleCreate?: (value: string) => void;
  isClearable?: boolean;
  marginBottom?: string;
  width?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  options,
  placeholder,
  label = "",
  onInputChange = () => {},
  onChangeValue = () => {},
  value: initialValue = null,
  disabled = false,
  colSpan = 6,
  AddButton = null,
  creatable = false,
  handleCreate = () => {},
  isClearable = false, // Default value for clearable
  marginBottom = "mb-5",
  width = "",
}) => {
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    initialValue
  );
  useEffect(() => {
    setSelectedOption(initialValue);
  }, [initialValue]);

  const handleChange = (option: SelectOption | null) => {
    setSelectedOption(option);
    if (onChangeValue) {
      onChangeValue(option);
    }
  };

  const commonProps = {
    isClearable,
    options,
    value: selectedOption,
    isDisabled: disabled,
    placeholder,
    onInputChange,
    onChange: handleChange,
    menuPortalTarget: typeof window !== "undefined" ? document.body : null,
    styles: customStyles,
    getOptionLabel: (option: SelectOption) => option.label,
    getOptionValue: (option: SelectOption) => option.value.toString(),
  };

  return (
    <div className={cn(tailwindColsClasses[colSpan], width)}>
      <div className={cn(marginBottom)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="mt-1 flex justify-between items-center">
          <div className="w-full mr-2">
            {creatable ? (
              <CreatableSelect {...commonProps} onCreateOption={handleCreate} />
            ) : (
              <Select {...commonProps} classNamePrefix="react-select" />
            )}
          </div>
          {AddButton && <div className="ml-2">{AddButton}</div>}
        </div>
      </div>
    </div>
  );
};

const customStyles = {
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
};

export default SelectField;
