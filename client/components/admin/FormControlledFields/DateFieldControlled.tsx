import {
  Control,
  Controller,
  FieldValues,
  Path,
  useController,
} from "react-hook-form";
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

interface DateFieldProps<TFieldValues extends FieldValues> {
  readOnly?: boolean;
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
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
}

const DateFieldControlled = <TFieldValues extends FieldValues>({
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
  formatType = "ISO",
  onlyYear = false,
  minDate,
  maxDate,
  showTimeInput = false,
}: DateFieldProps<TFieldValues>) => {
  if (!control) {
    console.error("Control prop is missing");
    return null; // Or render a fallback UI
  }
  const { fieldState, field } = useController({ name, control });
  const errorMessage = fieldState.error?.message;

  return (
    <>
      <div className={`col-span-${colSpan} `}>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700">
            {withCheckbox && setIsChecked && label && (
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
                <div className="form-group">
                  <div className="flex items-center">
                    <DatePicker
                      yearClassName={(date: Date) => {
                        const isSelected =
                          date.getFullYear() === field.value.getFullYear();

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
                        field.value
                          ? formatType === "ISO"
                            ? new Date(field.value)
                            : formatType === "dd-MM-yyyy"
                            ? new Date(field.value)
                            : new Date(field.value)
                          : null
                      }
                      onChange={(date) => {
                        if (formatType === "ISO") {
                          field.onChange(date);
                        } else if (formatType === "dd-MM-yyyy") {
                          const formattedDate = formatDateWithDashes(
                            date,
                            true
                          );
                          field.onChange(formattedDate);
                        } else {
                          const formattedDate = formatDateWithSlashes(date);
                          field.onChange(formattedDate);
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
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DateFieldControlled;
