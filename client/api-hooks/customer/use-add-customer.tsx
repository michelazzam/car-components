import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";

export interface AddEditCustomerBodyParam {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  tvaNumber?: string;
  note?: string;
}

const useAddCustomer = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) => {
  return usePostData<AddEditCustomerBodyParam>({
    queryKeysToInvalidate: [["invoices"], ["customers"]],
    endpoint: API.addCustomer,
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useAddCustomer };
