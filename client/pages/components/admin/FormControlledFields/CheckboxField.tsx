import { tailwindColsClasses } from "@/lib/config/tailwind-cols-classes";
import { cn } from "@/utils/cn";
import { Controller } from "react-hook-form";

interface CheckboxProps {
  readOnly?: boolean;
  control: any;
  name: string;
  label: string;
  colSpan?: number;
  description?: string;
  onValueChange?: (value: boolean) => void;
  containerClassnames?: string;
}

const CheckboxField: React.FC<CheckboxProps> = ({
  readOnly = false,
  control,
  name,
  label,
  colSpan = 6,
  description,
  onValueChange,
  containerClassnames,
}) => {
  return (
    <>
      <div className={tailwindColsClasses[colSpan]}>
        <div className="mt-3">
          <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => {
              const errorMessage = fieldState.error?.message;
              return (
                <div className={cn("relative")}>
                  <label
                    className={cn(
                      " text-sm font-medium text-gray-700 flex items-start",
                      containerClassnames || ""
                    )}
                  >
                    <input
                      readOnly={readOnly}
                      className="form-check-input me-2 !border-gray-400 border"
                      type="checkbox"
                      checked={field.value}
                      onChange={(value) => {
                        if (onValueChange) onValueChange(!field.value);
                        field.onChange(value);
                      }}
                      id={name}
                    />

                    <div>
                      <p className=" leading-none"> {label}</p>
                      <p className="text-gray-500 leading-10">{description}</p>
                    </div>
                  </label>

                  <div>
                    {errorMessage ? (
                      <p className="mt-2 text-sm text-red-600">
                        {errorMessage}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CheckboxField;
