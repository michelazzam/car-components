import SelectField from "@/components/admin/Fields/SlectField";
import React, { useEffect } from "react";
import { Option } from "react-multi-select-component";

function SelectMonthAndYear({
  setStartDate,
  setEndDate,
  setSelectedYear,
  setSelectedMonth,
  selectedYear,
  selectedMonth,
}: {
  setStartDate: (startDate: Date | null) => void;
  setEndDate: (endDate: Date | null) => void;
  setSelectedYear: (selectedYear: string | null) => void;
  setSelectedMonth: (selectedMonth: string | null) => void;
  selectedYear: string | null;
  selectedMonth: string | null;
}) {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 8;

  const yearsOptions: Option[] = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => ({
      label: (startYear + i).toString(),
      value: (startYear + i).toString(),
    })
  ).sort((a, b) => b.label.localeCompare(a.label)); //sort in descending order

  const monthsOptions: Option[] = Array.from({ length: 12 }, (_, i) => ({
    //here let the lavel be MMM
    label: new Date(currentYear, i, 1).toLocaleString("default", {
      month: "short",
    }),
    value: (i + 1).toString().padStart(2, "0"),
  }));

  useEffect(() => {
    // Update date range based on year and month selection
    handleUpdateDateRange();
  }, [selectedYear, selectedMonth]);

  const handleUpdateDateRange = () => {
    if (selectedYear && !selectedMonth) {
      const year = parseInt(selectedYear);
      setStartDate(new Date(year, 0, 1)); // January 1st
      setEndDate(new Date(year, 11, 31)); // December 31st
    } else if (selectedYear && selectedMonth) {
      const year = parseInt(selectedYear);
      const month = parseInt(selectedMonth) - 1;
      setStartDate(new Date(year, month, 1));
      const lastDay = new Date(year, month + 1, 0).getDate();
      setEndDate(new Date(year, month, lastDay));
    }
  };

  return (
    <>
      <SelectField
        placeholder="Choose Year"
        isClearable
        options={yearsOptions}
        onChangeValue={(option) => {
          if (
            typeof option?.value === "string" ||
            typeof option?.value === "undefined"
          ) {
            setSelectedYear(option ? option.value : null);
          }

          setSelectedMonth(null); // Clear month when year changes
        }}
        value={
          selectedYear
            ? yearsOptions.find((option) => option.value === selectedYear)
            : null
        }
        colSpan={2}
      />
      <SelectField
        placeholder="Choose Month"
        isClearable={true}
        options={monthsOptions}
        onChangeValue={(option) => {
          if (
            typeof option?.value === "string" ||
            typeof option?.value === "undefined"
          ) {
            setSelectedMonth(option ? option.value : null);
          }

          if (!selectedYear)
            setSelectedYear(new Date().getFullYear().toString());
        }}
        value={
          selectedMonth
            ? monthsOptions.find((option) => option.value === selectedMonth)
            : null
        }
        colSpan={2}
      />
    </>
  );
}

export default SelectMonthAndYear;
