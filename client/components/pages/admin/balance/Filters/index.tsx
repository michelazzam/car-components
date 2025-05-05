import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import {
  ReportByDateResponse,
  useGetReportsByDate,
} from "@/api-hooks/report/get-reports-by-date";
import SelectMonthAndYear from "../../common/SelectMonthAndYear";
import { formatDateWithDashes } from "@/lib/helpers/formatDate";
import {
  AllReportsResponse,
  useGetAllReports,
} from "@/api-hooks/report/get-all-reports";

function Filters({
  setTotalsReports,
  setAllReports,
  setIsPending,
}: {
  setTotalsReports: React.Dispatch<
    React.SetStateAction<ReportByDateResponse | undefined>
  >;
  setAllReports: React.Dispatch<
    React.SetStateAction<AllReportsResponse | undefined>
  >;
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  //------------------- STATES -------------------
  const [startDate, setStartDate] = React.useState<Date | null>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = React.useState<Date | null>(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  );
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  //------------------- CONSTANTS -------------------

  const apiStartDate = formatDateWithDashes(startDate, true) || "";
  const apiEndDate = formatDateWithDashes(endDate, true) || "";

  //------------------- API CALLS -------------------
  const { data: totals, isPending } = useGetReportsByDate({
    startDate: apiStartDate,
    endDate: apiEndDate,
  });

  const { data: allReports } = useGetAllReports({
    startDate: apiStartDate,
    endDate: apiEndDate,
    pageIndex: 0,
    pageSize: 100,
  });

  //------------------- EFFECTS -------------------
  useEffect(() => {
    if (totals) {
      setTotalsReports(totals);
    }
    if (allReports) {
      setAllReports(allReports);
    }
    setIsPending(isPending);
  }, [totals, allReports]);

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

  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2">
          <DatePicker
            className="w-full focus:z-10 py-3.5 rounded-md mt-1 "
            placeholderText="Choose Date Range"
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            dateFormat={"yyyy/MM/dd"}
            onChange={handleDateChange}
            isClearable={false}
          />
        </div>

        <SelectMonthAndYear
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setSelectedYear={setSelectedYear}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      </div>
    </div>
  );
}

export default Filters;
