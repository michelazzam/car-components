import { API } from "@/constants/apiEndpoints";
import { useUpdateData } from "@/api-service/useUpdateData";
import { AddEditCustomerBodyParam } from "./use-add-customer";

const useEditCustomer = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<AddEditCustomerBodyParam>({
    queryKeysToInvalidate: [["customers"]],
    endpoint: API.editCustomer(id),
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useEditCustomer };
