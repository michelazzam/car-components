// MultiSelectFieldControlled.tsx

import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  CSSProperties,
} from "react";
import { Control, useController } from "react-hook-form";
import { cn } from "@/utils/cn";
import { FaTimes } from "react-icons/fa";
import Checkbox from "../Fields/Checkbox";
import { tailwindColsClasses } from "@/lib/config/tailwind-cols-classes";
import { SelectOption } from "../Fields/SlectField";
import Portal from "@/components/common/Portal";

interface MultiSelectFieldControlledProps {
  isClearable?: boolean;
  options: SelectOption[];
  colSpan?: number;
  name: string;
  label?: string;
  control: Control<any>;
  disabled?: boolean;
  placeholder: string;
  treatAsObject?: boolean;
  onSearchChange?: (value: string) => void;
}

export default function MultiSelectFieldControlled({
  isClearable = false,
  options = [],
  colSpan = 2,
  name,
  label,
  control,
  disabled = false,
  placeholder,
  onSearchChange,
  treatAsObject = false,
}: MultiSelectFieldControlledProps) {
  const { field } = useController({ name, control });

  const initialValue = field.value
    ? Array.isArray(field.value)
      ? field.value
      : field.value.split(",")
    : [];
  const selectedValues: any[] = initialValue;

  // Dropdown states
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyles, setDropdownStyles] = useState<CSSProperties>();

  // Refs
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter + sort the options
  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options]);

  const sortedOptions = useMemo(() => {
    return [...filteredOptions].sort((a, b) => {
      const aSelected = selectedValues.includes(a.value);
      const bSelected = selectedValues.includes(b.value);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return a.label.localeCompare(b.label);
    });
  }, [filteredOptions, selectedValues]);

  // Compute dropdown position whenever opened
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setDropdownStyles({
      position: "absolute",
      top: rect.bottom + window.scrollY + "px",
      left: rect.left + window.scrollX + "px",
      minWidth: rect.width + "px",
      zIndex: 9999999,
    });
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      // If open, and click is not inside the button or the dropdown
      if (
        isOpen &&
        buttonRef.current &&
        dropdownRef.current &&
        !buttonRef.current.contains(target) &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Toggle an option
  function handleCheckboxChange(option: SelectOption) {
    let newValues;
    if (treatAsObject) {
      if (selectedValues.map((v) => v.value).includes(option.value)) {
        console.log("REMOVE VALUE IS : ", option);
        newValues = selectedValues.filter((v) => v.value !== option.value);
      } else {
        newValues = [...selectedValues, option];
      }
      console.log("NEW VALUES ARE : ", newValues);
    } else {
      if (selectedValues.includes(option.value)) {
        newValues = selectedValues.filter((v) => v !== option.value);
      } else {
        newValues = [...selectedValues, option.value];
      }
    }
    field.onChange(newValues);
  }

  // Clear all selections
  function handleClear() {
    field.onChange([]);
  }

  // For display
  const isSelectedSome = selectedValues.length > 0;
  return (
    <div className={cn("relative w-full mb-5", tailwindColsClasses[colSpan])}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full rounded-md border border-gray-300 mt-1 flex items-center justify-between focus:border-gray-200 text-start px-2 py-2.5 shadow-sm  disabled:bg-[#f3f4f6]",
          isSelectedSome ? "text-gray-800" : "text-gray-600"
        )}
      >
        <p className="truncate">
          {isSelectedSome
            ? treatAsObject
              ? selectedValues.map((v) => v.label).join(", ")
              : selectedValues
                  .map((v) => options.find((o) => o.value === v)?.label)
                  .join(", ")
            : placeholder}
        </p>
        <span onClick={handleClear} className="cursor-pointer">
          <FaTimes />
        </span>
      </button>

      {/* The dropdown is portaled so it won't be clipped by parent overflow */}
      {isOpen && dropdownStyles && (
        <Portal>
          <div
            ref={dropdownRef}
            style={dropdownStyles}
            className="bg-white border border-gray-300 shadow-lg rounded-lg p-2 max-h-60 overflow-y-auto"
          >
            {/* Search field */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onSearchChange?.(e.target.value);
              }}
              placeholder="Search..."
              className="mb-2 p-2 border rounded w-full text-sm text-gray-600"
            />

            {/* Checkbox list */}
            {sortedOptions.map((option) => {
              const isChecked = treatAsObject
                ? selectedValues.map((v) => v.value).includes(option.value)
                : selectedValues.includes(option.value);
              return (
                <div key={option.value}>
                  <Checkbox
                    label={option.label}
                    isChecked={isChecked}
                    onValueChange={() => handleCheckboxChange(option)}
                    className="py-1"
                  />
                </div>
              );
            })}

            {/* Always show Clear button if isClearable is true */}
            {isClearable && (
              <button
                type="button"
                onClick={handleClear}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Clear Selection
              </button>
            )}
          </div>
        </Portal>
      )}
    </div>
  );
}
