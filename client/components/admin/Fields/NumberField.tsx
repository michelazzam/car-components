interface NumberFieldProps {
  prefix?: string;
  suffix?: string;
  marginBottom?: string;
  decimalsLimit?: number;
  readOnly?: boolean;
  label?: string;
  colSpan?: number;
  withCheckbox?: boolean;
  isChecked?: boolean;
  setIsChecked?: (checked: boolean) => void;
  value: string | number; // Value managed externally
  onChange: (value: string | number | undefined) => void; // onChange handler managed externally
  errorMessage?: string;
  onBlur?: (value: number) => void;
}
import { tailwindColsClasses } from "@/lib/config/tailwind-cols-classes";
import { cn } from "@/utils/cn";
import React from "react";
import CurrencyInput from "react-currency-input-field";

const NumberField: React.FC<NumberFieldProps> = ({
  prefix = "",
  marginBottom = "mb-5",
  suffix = "",
  decimalsLimit = 2,
  readOnly = false,
  label,
  colSpan = 6,
  withCheckbox = false,
  isChecked = false,
  setIsChecked,
  value,
  onChange,
  onBlur,
  errorMessage,
}) => {
  const handleCurrencyChange = (value?: string | undefined) => {
    onChange(value); // Call the external onChange function
  };

  const handleCurrencyBlur = () => {
    const numericValue =
      value && parseFloat(value.toString().replace(/[^\d.-]/g, ""));
    onChange(numericValue || 0); // Normalize the value on blur and call external onChange
    onBlur?.(numericValue || 0);
  };

  return (
    <>
      <div className={tailwindColsClasses[colSpan]}>
        <div className={marginBottom}>
          <label className="block text-sm font-medium text-gray-700">
            {withCheckbox && setIsChecked && (
              <input
                className="form-check-input me-2"
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked && setIsChecked(e.target.checked)}
                id={`${name}-checkbox`}
              />
            )}
            {label}
          </label>
          <div className="relative">
            <div className="flex items-center">
              <CurrencyInput
                onBlur={handleCurrencyBlur}
                value={value?.toString()}
                prefix={prefix}
                suffix={suffix}
                disabled={(!isChecked && withCheckbox) || readOnly}
                className={cn(
                  "block w-full mt-1 px-3 py-2 border  disabled:bg-[#f3f4f6] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                  errorMessage ? "border-red/50 " : "border-gray-300 "
                )}
                onValueChange={handleCurrencyChange}
                decimalsLimit={decimalsLimit}
                allowDecimals
              />
            </div>
            <div className="absolute -bottom-5">
              {errorMessage ? (
                <p className=" text-sm text-red">{errorMessage}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NumberField;
