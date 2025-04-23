import { Controller, useController } from "react-hook-form";
import React, { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { cn } from "@/utils/cn";
import { tailwindColsClasses } from "@/lib/config/tailwind-cols-classes";

interface NumberFieldProps {
  prefix?: string;
  suffix?: string;
  decimalsLimit?: number;
  readOnly?: boolean;
  localError?: string;
  control: any; // You can replace 'any' with the specific type for your control if known
  name: string;
  label?: string;
  colSpan?: number;
  withCheckbox?: boolean;
  setIsChecked?: (checked: boolean) => void;
  onChangeValue?: (value: string | number | null) => void;
  [x: string]: any; // To allow any other additional props
}

const NumberFieldControlled: React.FC<NumberFieldProps> = ({
  prefix = "",
  suffix = "",
  decimalsLimit = 2,
  readOnly = false,
  control,
  name,
  label,
  localErorr,
  colSpan = 6,
  withCheckbox = false,
  isChecked = false,
  setIsChecked,
  onChangeValue = () => {},
  min,
  max,
}) => {
  if (!control) return null;
  const { fieldState, field } = useController({ name, control });

  const errorMessage = fieldState.error?.message || localErorr;

  const [displayValue, setDisplayValue] = useState<string | number | undefined>(
    field.value
  );

  useEffect(() => {
    if (field.value) {
      setDisplayValue(field.value);
    }

    return () => {
      setDisplayValue(0);
    };
  }, [field.value]);

  const handleCurrencyChange = (value?: string | undefined) => {
    // Update the display value without converting it
    setDisplayValue(value);
    onChangeValue(value || null);
  };

  const handleCurrencyBlur = () => {
    // Convert the display value to a number and update the field on blur
    const numericValue =
      displayValue &&
      parseFloat(displayValue.toString().replace(/[^\d.-]/g, ""));
    field.onChange(numericValue || 0); // Fallback to 0 if NaN
  };

  return (
    <>
      <div className={tailwindColsClasses[colSpan]}>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700">
            {withCheckbox && setIsChecked && (
              <input
                className="form-check-input me-2"
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                id="checkebox-md"
              />
            )}
            {label}
          </label>
          <Controller
            control={control}
            name={name}
            render={() => (
              <div className="relative">
                <div className="flex items-center">
                  <CurrencyInput
                    onBlur={handleCurrencyBlur}
                    value={displayValue}
                    prefix={prefix}
                    suffix={suffix}
                    disabled={(!isChecked && withCheckbox) || readOnly}
                    className={cn(
                      "block w-full mt-1 px-3 py-2 border  disabled:bg-[#f3f4f6] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                      errorMessage ? "border-red/50 " : "border-gray-300 "
                    )}
                    onValueChange={handleCurrencyChange}
                    min={min}
                    max={max}
                    decimalsLimit={decimalsLimit}
                  />
                </div>

                <div className="absolute -bottom-5">
                  {errorMessage ? (
                    <p className="mt-2 text-sm text-red">{errorMessage}</p>
                  ) : null}
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </>
  );
};

export default NumberFieldControlled;
