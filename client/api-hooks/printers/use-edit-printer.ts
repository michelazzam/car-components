import { useUpdateData } from "@/api-service/useUpdateData";
import { API } from "@/constants/apiEndpoints";
import { PrinterSchema } from "@/lib/apiValidations";

const useEditPrinter = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<PrinterSchema>({
    queryKeysToInvalidate: [["printers"]],
    endpoint: API.editPrinter(id),
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useEditPrinter };
