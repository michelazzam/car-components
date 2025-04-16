import { tailwindColsClasses } from "@/lib/config/tailwind-cols-classes";
import CurrencyInput from "react-currency-input-field";
import Select from "react-select";

interface SelectOption {
  label: string;
  value: string | number;
}
interface NumberWithSelectOptionsFieldProps {
  readOnly?: boolean;
  colSpan?: number;
  placeholder?: string;
  label?: string;
  value: number | string | undefined;
  onChange: (value: number | string | undefined) => void;
  prefix?: string;
  suffix?: string;
  decimalsLimit: number;
  //select options

  options: SelectOption[];
  onInputChange?: (value: string) => void;
  onChangeValue?: (value: string | number | null) => void;
  selectValue?: string | number | null;
  //error message
  errorMessage?: string;
}

const NumberWithSelectOptionsField: React.FC<
  NumberWithSelectOptionsFieldProps
> = ({
  readOnly = false,
  colSpan = 6,
  placeholder = "Enter text",
  label,
  value,
  onChange,
  prefix,
  suffix,
  decimalsLimit,
  //select options
  options,
  onInputChange = () => {},
  onChangeValue = () => {},
  selectValue,
  //error message
  errorMessage,
}) => {
  return (
    <>
      <div className={tailwindColsClasses[colSpan]}>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {errorMessage && <span></span>}
          </label>
          <div className="relative">
            <div className="grid grid-cols-12 items-center border border-gray-300 rounded-md">
              <div className="col-span-9">
                <CurrencyInput
                  placeholder={placeholder}
                  value={value}
                  prefix={prefix}
                  suffix={suffix}
                  disabled={readOnly}
                  className="block w-full mt-1 pl-3 py-2  focus:outline-none  sm:text-sm border-0 shadow-none "
                  onValueChange={onChange}
                  decimalsLimit={decimalsLimit}
                />
              </div>
              <div className="col-span-3">
                <Select
                  className=""
                  onInputChange={onInputChange}
                  options={options}
                  value={
                    options?.find((option) => option.value === selectValue) ||
                    null
                  }
                  onChange={(selectedOption: SelectOption | null) => {
                    const value = selectedOption ? selectedOption.value : "";
                    onChangeValue(value); // Trigger any additional onChange callbacks
                    console.log("Value", selectedOption);
                  }}
                  menuPortalTarget={
                    typeof window !== "undefined" ? document.body : null
                  }
                  styles={customStyles}
                  getOptionLabel={(option: SelectOption) => option.label}
                  getOptionValue={(option: SelectOption) =>
                    option.value.toString()
                  }
                />
              </div>
            </div>

            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NumberWithSelectOptionsField;

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: "none", // Removes the border
    boxShadow: "none", // Removes the box-shadow if any
  }),

  menuPortal: (provided: any) => ({
    ...provided,
    zIndex: 9999,
  }),
  indicatorSeparator: () => ({
    display: "none", // This will hide the separator
  }),
};
