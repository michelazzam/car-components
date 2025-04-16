
import { API } from "@/constants/apiEndpoints";
import { useUpdateData } from "@/api-service/useUpdateData";
import { AddInvoiceSchema } from "@/lib/apiValidations";


const useEditInvoice = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: (data: any) => void;
}) => {
  return useUpdateData<AddInvoiceSchema>({
    queryKeysToInvalidate: [["orders"]],
    endpoint: API.editInvoice(id),
    callBackOnSuccess: callBackOnSuccess,
  });
};
export { useEditInvoice };
