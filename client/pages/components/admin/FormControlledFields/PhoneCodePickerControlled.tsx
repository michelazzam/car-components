import React from "react";
import {
  Control,
  Controller,
  UseControllerProps,
  useController,
} from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { AsYouType } from "libphonenumber-js";
import { cn } from "@/utils/cn";
import { tailwindColsClasses } from "@/lib/config/tailwind-cols-classes";

interface PhoneCodePickerProps extends UseControllerProps {
  label: string;
  colSpan?: number;
  disabled?: boolean;
  control: Control<any>;
}

const PhoneCodePickerControlled: React.FC<PhoneCodePickerProps> = ({
  control,
  name,
  label,
  colSpan = 6,
  disabled = false,
  ...props
}) => {
  if (!control) return null;
  const { fieldState, field } = useController({ name, control });
  const errorMessage = fieldState.error?.message;

  const handlePhoneChange = (phone: string) => {
    // Ensure the phone number starts with the correct country code and is properly formatted
    let formattedPhone = new AsYouType("LB").input(phone);

    // Replace all spaces and format the number as '961-76552423'
    formattedPhone = formattedPhone.replace(/\s+/g, "");
    formattedPhone = formattedPhone.slice(0, 3) + "-" + formattedPhone.slice(3);

    field.onChange(formattedPhone);
  };

  return (
    <div className={tailwindColsClasses[colSpan]}>
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <Controller
          control={control}
          name={name}
          render={() => (
            <div className="relative mt-1">
              <div className="flex items-center">
                <PhoneInput
                  containerStyle={{
                    backgroundColor: disabled ? "#f3f4f6" : "#fff",
                    padding: "0.1rem 0",
                    width: "100%",
                    border: errorMessage ? "" : "1px solid rgb(230 234 235)",
                    borderRadius: "0.5rem",
                    boxShadow:
                      "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)",
                  }}
                  inputStyle={{
                    border: "none",

                    width: "100%",
                    backgroundColor: disabled ? "#f3f4f6" : "#fff",
                    color: disabled ? "#6b7280" : "#000",
                  }}
                  buttonStyle={{
                    borderRadius: "0.5rem 0 0 0.5rem",
                    border: "none",
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                  containerClass={cn(
                    "w-full",
                    errorMessage ? "border border-red/50" : ""
                  )}
                  buttonClass="border-none"
                  disabled={disabled}
                  country={"lb"}
                  value={field.value || ""}
                  onChange={handlePhoneChange}
                  excludeCountries={["IL"]}
                  {...props}
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
  );
};

export default PhoneCodePickerControlled;
