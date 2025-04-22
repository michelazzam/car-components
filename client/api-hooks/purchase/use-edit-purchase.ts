import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";
import { AddPurchaseT } from "./use-add-purchase";

export const useEditPurchase = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) => {
  return usePostData<AddPurchaseT>({
    endpoint: API.editPurchase(id),
    queryKeysToInvalidate: [["purchases"]],
    callBackOnSuccess,
  });
};
