import { IconType } from "react-icons/lib";
import DatePicker from "react-datepicker";
import { cn } from "@/utils/cn";
import {
  formatDateWithDashes,
  formatDateWithSlashes,
} from "@/lib/helpers/formatDate";

declare module "react-datepicker" {
  export interface ReactDatePickerProps {
    yearClassName?: (date: Date) => string;
  }
}

interface DateFieldProps {
  readOnly?: boolean;
  value: Date | null;
  onChange: (value: Date | null | string) => void;
  label: string;
  colSpan?: number;
  withCheckbox?: boolean;
  setIsChecked?: (checked: boolean) => void;
  isChecked?: boolean;
  placeholder?: string;
  actionButtonTitle?: string;
  onClickActionButton?: () => void;
  ActionButtonIcon?: IconType;
  formatType?: "ISO" | "dd/MM/yyyy" | "dd-MM-yyyy";
  onlyYear?: boolean;
  minDate?: Date;
  maxDate?: Date;
  showTimeInput?: boolean;
  errorMessage?: string;
}

const DateField: React.FC<DateFieldProps> = ({
  readOnly = false,
  value,
  onChange,
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
  formatType = "ISO",
  onlyYear = false,
  minDate,
  maxDate,
  showTimeInput = false,
  errorMessage,
}: DateFieldProps) => {
  return (
    <>
      <div className={`col-span-${colSpan} `}>
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
          <div>
            <div className="form-group">
              <div className="flex items-center">
                <DatePicker
                  yearClassName={(date: Date) => {
                    const isSelected =
                      date.getFullYear() === value?.getFullYear();

                    return "py-1" + (isSelected ? " bg-secondary" : "");
                  }}
                  wrapperClassName="w-full"
                  popperClassName="!z-[50]"
                  className={cn(
                    "mt-1 block !w-full rounded-sm border !py-5 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-[#f3f4f6] disabled:text-[#6b7280] sm:text-sm",
                    errorMessage ? "!border-red/50" : "!border-neutral-200"
                  )}
                  placeholderText={placeholder}
                  selected={
                    value
                      ? formatType === "ISO"
                        ? new Date(value)
                        : formatType === "dd-MM-yyyy"
                        ? new Date(value)
                        : new Date(value)
                      : null
                  }
                  onChange={(date: Date) => {
                    if (formatType === "ISO") {
                      onChange(date);
                    } else if (formatType === "dd-MM-yyyy") {
                      const formattedDate = formatDateWithDashes(date, true);
                      onChange(formattedDate);
                    } else {
                      const formattedDate = formatDateWithSlashes(date);
                      onChange(formattedDate);
                    }
                  }}
                  showTimeInput={showTimeInput}
                  minDate={minDate}
                  maxDate={maxDate}
                  showYearPicker={onlyYear ? true : false}
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  dateFormat={
                    onlyYear
                      ? "yyyy"
                      : "dd/MM/yyyy" + (showTimeInput ? " HH:mm" : "")
                  }
                  disabled={(!isChecked && withCheckbox) || readOnly}
                />
              </div>
              <div className="relative">
                {actionButtonTitle && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-primary"
                    data-hs-overlay={"#primary-modal"}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default DateField;
