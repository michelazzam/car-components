import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export interface Printer {
  _id: string;
  name: string;
  ipAddress: string;
}

const useListPrinters = () => {
  return useReadData<Printer[]>({
    queryKey: ["printers"],
    endpoint: API.listPrinters,
  });
};

export { useListPrinters };
