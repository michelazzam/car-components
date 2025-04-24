import { API } from "@/constants/apiEndpoints";
import { AddPurchaseT } from "./use-add-purchase";
import { useUpdateData } from "@/api-service/useUpdateData";

export const useEditPurchase = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<AddPurchaseT>({
    endpoint: API.editPurchase(id),
    queryKeysToInvalidate: [["purchases"]],
    callBackOnSuccess,
  });
};
