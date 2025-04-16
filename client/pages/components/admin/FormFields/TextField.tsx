import { cn } from "@/utils/cn";
import { Controller, useController } from "react-hook-form";
import { IconType } from "react-icons/lib";
import { tailwindColsClasses } from "@/lib/config/tailwind-cols-classes";
import { capitalizeWord } from "@/utils/capitalize-word";

interface TextFieldProps {
  readOnly?: boolean;
  control: any;
  name: string;
  label: string;
  colSpan?: number;
  withCheckbox?: boolean;
  setIsChecked?: (checked: boolean) => void;
  isChecked?: boolean;
  placeholder?: string;
  actionButtonTitle?: string;
  onClickActionButton?: () => void;
  ActionButtonIcon?: IconType;
  dontCapitalize?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  readOnly = false,
  control,
  name,
  label,
  colSpan = 6,
  withCheckbox = false,
  isChecked = false,
  setIsChecked,
  placeholder = "Enter text",
  //action button
  actionButtonTitle,
  onClickActionButton,
  ActionButtonIcon,
  dontCapitalize = false,
}) => {
  if (!control) return null;
  const { fieldState, field } = useController({ name, control });

  const errorMessage = fieldState.error?.message;

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
                  <input
                    placeholder={placeholder}
                    value={field.value}
                    onChange={(e) => {
                      if (dontCapitalize) field.onChange(e.target.value);
                      else field.onChange(capitalizeWord(e.target.value || ""));
                    }}
                    disabled={(!isChecked && withCheckbox) || readOnly}
                    className={cn(
                      `block w-full mt-1 px-3 py-2 border  disabled:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:text-[#6b7280] rounded-md shadow-sm  sm:text-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`,
                      errorMessage ? "border-red/50 " : "border-gray-300 ",
                      dontCapitalize ? "" : "capitalize"
                    )}
                  />
                </div>
                {actionButtonTitle && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-primary"
                    data-hs-overlay={`#primary-modal`}
                    onClick={onClickActionButton}
                  >
                    {ActionButtonIcon && (
                      <ActionButtonIcon className="size-5" />
                    )}

                    <span className="font-bold">{actionButtonTitle}</span>
                  </button>
                )}
                <div className="absolute -bottom-5">
                  {errorMessage ? (
                    <p className=" text-sm text-red">{errorMessage}</p>
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

export default TextField;
