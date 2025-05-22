import { Billing } from "@/pages/admin/ams/billing";
import { useReadData } from "../useReadData";
import { API } from "@/constants/apiEndpoints";

export const useGetBilling = () => {
  return useReadData<Billing[]>({
    queryKey: ["billing"],
    endpoint: API.getBilling,
  });
};
