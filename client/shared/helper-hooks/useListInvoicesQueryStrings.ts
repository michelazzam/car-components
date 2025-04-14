import { useQueryStrings } from "@/hooks/useQueryStrings";

function useListInvoicesQueryStrings() {
  const { currentQueries, appendQueries } = useQueryStrings();

  const paymentStatus = currentQueries.paymentStatus;
  const setPaymentStatus = (paymentStatus: string) => {
    appendQueries({ paymentStatus });
  };

  const pageSize = Number(currentQueries.pageSize) || 10;
  const pageIndex = Number(currentQueries.pageIndex) || 0;

  const search = currentQueries.search || "";
  const setSearch = (search: string) => {
    appendQueries({ search });
  };
  const startDate = currentQueries.startDate
    ? new Date(currentQueries.startDate?.toString())
    : null;
  const setStartDate = (startDate: Date | null) => {
    console.log({ startDate });
    appendQueries({ startDate: startDate ? startDate?.toString() : "" });
  };
  const endDate = currentQueries.endDate
    ? new Date(currentQueries.endDate?.toString())
    : null;
  const setEndDate = (endDate: Date | null) => {
    console.log({ endDate });
    appendQueries({ endDate: endDate ? endDate?.toString() : "" });
  };
  const clearDates = () => {
    appendQueries({ startDate: "", endDate: "" });
  };

  const selectedVehicleId = currentQueries.vehicleId;
  const setSelectedVehicleId = (vehicleId: string) => {
    appendQueries({ vehicleId });
  };

  return {
    paymentStatus,
    setPaymentStatus,
    pageSize,
    pageIndex,
    search,
    setSearch,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearDates,
    selectedVehicleId,
    setSelectedVehicleId,
  };
}

export default useListInvoicesQueryStrings;
