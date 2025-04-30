import { tailwindColsClasses } from "@/lib/config/tailwind-cols-classes";
import { capitalizeWord } from "@/utils/capitalize-word";
import { cn } from "@/utils/cn";
import { IconType } from "react-icons/lib";

interface TextFieldProps {
  readOnly?: boolean;
  label?: string;
  colSpan?: number;
  withCheckbox?: boolean;
  setIsChecked?: (checked: boolean) => void;
  isChecked?: boolean;
  placeholder?: string;
  actionButtonTitle?: string;
  onClickActionButton?: () => void;
  ActionButtonIcon?: IconType;
  value: string;
  onChange: (value: string | undefined) => void;
  errorMessage?: string;
  dontCapitalize?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  readOnly = false,

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
  value,
  onChange,
  errorMessage,
  dontCapitalize = false,
}) => {
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

          <div className="relative">
            <div className="flex items-center">
              <input
                placeholder={placeholder}
                value={value}
                onChange={(e) => {
                  if (dontCapitalize) onChange(e.target.value);
                  else onChange(capitalizeWord(e.target.value.toString()));
                }}
                disabled={(!isChecked && withCheckbox) || readOnly}
                className={cn(
                  `block w-full mt-1 px-3 py-2 border  disabled:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:text-[#6b7280] rounded-md shadow-sm  sm:text-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none capitalize  `,
                  errorMessage ? "border-red/50 " : "border-gray-300 "
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
                {ActionButtonIcon && <ActionButtonIcon className="size-5" />}

                <span className="font-bold">{actionButtonTitle}</span>
              </button>
            )}
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

export default TextField;
