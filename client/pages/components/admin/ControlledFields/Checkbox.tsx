import React from "react";

function Checkbox({
  readOnly = false,
  label,
  description,
  onValueChange,
  isChecked,
  setIsChecked,
}: {
  readOnly?: boolean;
  label?: string;
  description?: string;
  onValueChange?: (value: boolean) => void;
  isChecked: boolean;
  setIsChecked?: (value: boolean) => void;
}) {
  return (
    <>
      <div className="">
        <label className=" text-sm font-medium text-gray-700 flex items-center">
          <input
            readOnly={readOnly}
            className="form-check-input me-2 !border-gray-400 border cursor-pointer"
            type="checkbox"
            checked={isChecked}
            onChange={() => {
              if (onValueChange) onValueChange(!isChecked);
              setIsChecked && setIsChecked(!isChecked);
            }}
            id="checkebox-md"
          />

          <div>
            <p className=" leading-none"> {label}</p>
            <p className="text-gray-500 leading-10">{description}</p>
          </div>
        </label>
      </div>
    </>
  );
}

export default Checkbox;
