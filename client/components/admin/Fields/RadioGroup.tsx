import { cn } from "@/utils/cn";
import React, { useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface RadioGroupProps {
  defaultValue: string;
  options: Option[];
  gridNumber?: number; // Number of radios per row
  isFlex?: boolean;
  onChange: (value: string) => void; // Callback function to pass the selected value back
}

function RadioGroup({
  defaultValue,
  options,
  gridNumber,
  isFlex = false,
  onChange,
}: RadioGroupProps) {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue); // Initialize state with defaultValue

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
    onChange(value); // This passes the selected value to the parent component
  };

  return (
    <div
      className={cn(
        isFlex
          ? " flex items-center gap-x-2"
          : `grid grid-cols-${gridNumber} gap-4`
      )}
    >
      {options?.map((option, index) => (
        <label key={index} className="flex items-center space-x-2">
          <input
            type="radio"
            name="payment"
            className="form-radio text-blue-600"
            checked={selectedValue === option.value}
            onChange={() => handleRadioChange(option.value)}
          />
          <span className="text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

export default RadioGroup;
