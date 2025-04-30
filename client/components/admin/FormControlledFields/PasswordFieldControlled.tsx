import { cn } from "@/utils/cn";
import { useState } from "react";
import { Controller, useController } from "react-hook-form";
import { tailwindColsClasses } from "@/lib/config/tailwind-cols-classes";

interface PasswordFieldProps {
  readOnly?: boolean;
  placeholder?: string;
  control: any;
  name: string;
  label: string;
  colSpan?: number;
  withCheckbox?: boolean;
  setIsChecked?: (checked: boolean) => void;
  isChecked?: boolean;
}

const PasswordFieldControlled: React.FC<PasswordFieldProps> = ({
  readOnly = false,
  placeholder = "Password",
  control,
  name,
  label,
  colSpan = 6,
  withCheckbox = false,
  isChecked = false,
  setIsChecked,
}) => {
  if (!control) return null;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { fieldState, field } = useController({ name, control });

  const errorMessage = fieldState.error?.message;
  const OpenedEye = <i className="bi bi-eye-fill"></i>;
  const ClosedEye = <i className="bi bi-eye-slash-fill"></i>;
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
                <div className="flex items-center relative mt-1">
                  <input
                    placeholder={placeholder}
                    type={isPasswordVisible ? "text" : "password"}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={(!isChecked && withCheckbox) || readOnly}
                    className={cn(
                      "block w-full  px-3 py-2 border  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                      errorMessage ? "border-red/50 " : "border-gray-300 "
                    )}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 "
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? OpenedEye : ClosedEye}
                  </button>
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

export default PasswordFieldControlled;
