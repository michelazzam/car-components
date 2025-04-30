import React, { useState, useEffect } from "react";
import { Option } from "react-multi-select-component";

import DatePicker from "react-datepicker";
import SelectField from "@/components/admin/Fields/SlectField";

function Filters({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setPageIndex,
}: {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  //------------------- STATES -------------------

  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  //------------------- CONSTANTS -------------------

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 8;

  //------------------- EFFECTS -------------------

  useEffect(() => {
    // Update date range based on year and month selection
    handleUpdateDateRange();
  }, [selectedYear, selectedMonth]);

  //------------------- OPTIONS DATA -------------------
  const yearsOptions: Option[] = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => ({
      label: (startYear + i).toString(),
      value: (startYear + i).toString(),
    })
  );
  const monthsOptions: Option[] = Array.from({ length: 12 }, (_, i) => ({
    //here let the lavel be MMM
    label: new Date(currentYear, i, 1).toLocaleString("default", {
      month: "short",
    }),
    value: (i + 1).toString().padStart(2, "0"),
  }));

  //------------------- HANDLERS & FUNCTIONS -------------------
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      setSelectedYear(null);
      setSelectedMonth(null);
    }
  };

  const handleUpdateDateRange = () => {
    setPageIndex(1);
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
    <div>
      {" "}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <DatePicker
            className="w-full focus:z-10 py-3.5 rounded-md mt-1 "
            placeholderText="Choose Date Range"
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            isClearable={false}
          />
        </div>
        <SelectField
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
          colSpan={3}
        />
        <SelectField
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
          colSpan={3}
        />
      </div>
    </div>
  );
}

export default Filters;
