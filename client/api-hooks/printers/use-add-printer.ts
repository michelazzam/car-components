import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";
import { PrinterSchema } from "@/lib/apiValidations";

const useAddPrinter = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) => {
  return usePostData<PrinterSchema>({
    queryKeysToInvalidate: [["printers"]],
    endpoint: API.addPrinter,
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useAddPrinter };
