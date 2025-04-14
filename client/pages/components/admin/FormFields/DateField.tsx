import { Controller, useController } from "react-hook-form";
import { IconType } from "react-icons/lib";
import DatePicker from "react-datepicker";
import { cn } from "@/utils/cn";
import { tailwindColsClasses } from "@/lib/config/tailwind-cols-classes";

interface DateFieldProps {
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
}

const DateField: React.FC<DateFieldProps> = ({
  readOnly = false,
  control,
  name,
  label,
  colSpan = 6,
  withCheckbox = false,
  isChecked = false,
  setIsChecked,
  placeholder = "Choose Date",
  //action button
  actionButtonTitle,
  onClickActionButton,
  ActionButtonIcon,
}) => {
  if (!control) return null;
  const { fieldState, field } = useController({ name, control: control });

  const errorMessage = fieldState.error?.message;

  return (
    <>
      <div className={tailwindColsClasses[colSpan]}>
        <div className="mb-5 ">
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
          <div>
            <Controller
              control={control}
              name={name}
              render={() => (
                <div
                  className=" form-group 
                 
           
                "
                >
                  <div className="flex items-center ">
                    <DatePicker
                      className={cn(
                        " block w-full mt-1 px-3 !py-5 border  disabled:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:text-[#6b7280] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ",
                        errorMessage ? "!border-red/50 " : "!border-gray-300 "
                      )}
                      placeholderText={placeholder}
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="MM/dd/yyyy" // Ensure the date format is just for the date
                      disabled={(!isChecked && withCheckbox) || readOnly}
                    />
                  </div>
                  <div className="relative">
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
                        <p className="mt-2 text-sm text-red">{errorMessage}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DateField;
