import { cn } from "@/utils/cn";
import DatePicker from "react-datepicker";
import { formatDateWithDashes, safeParseDate } from "@/lib/helpers/formatDate";
import { tailwindColsClasses } from "@/lib/config/tailwind-cols-classes";

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}
interface DateRangeFieldProps {
  readOnly?: boolean;
  label?: string;
  colSpan?: number;
  marginBottom?: string;
  dates: DateRange;
  setDates: (dates: DateRange) => void;
}

const DateRangeField: React.FC<DateRangeFieldProps> = ({
  label,
  colSpan = 6,
  readOnly,
  marginBottom = "mb-5",
  dates,
  setDates,
}) => {
  const startDate = dates.startDate;
  const endDate = dates.endDate;

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    if (!dates[0] && !dates[1]) {
      setDates({
        startDate: null,
        endDate: null,
      });
    }
    const [start, end] = dates;

    setDates({
      startDate: start ? formatDateWithDashes(start, true) : null,
      endDate: end ? formatDateWithDashes(end, true) : null,
    });
  };

  return (
    <div className={cn(tailwindColsClasses[colSpan], marginBottom)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <DatePicker
        readOnly={readOnly}
        className={cn(
          " block w-full mt-1 px-3 !py-5 border  disabled:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:text-[#6b7280] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ",
          "!border-gray-300 "
        )}
        selectsRange={true}
        startDate={startDate ? safeParseDate(startDate) : null}
        endDate={endDate ? safeParseDate(endDate) : null}
        onChange={handleDateChange}
        isClearable={true}
        placeholderText="Select date range"
      />
    </div>
  );
};

export default DateRangeField;
