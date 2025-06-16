import { API } from "@/constants/apiEndpoints";
import { AddPurchaseItemT, AddPurchaseT } from "./use-add-purchase";
import { useUpdateData } from "@/api-service/useUpdateData";

export const useEditPurchase = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<EditPurchaseT>({
    endpoint: API.editPurchase(id),
    queryKeysToInvalidate: [["purchases"], ["caisse"]],
    callBackOnSuccess,
  });
};

export type EditPurchaseItemT = AddPurchaseItemT & {
  quantityReturned: number;
};

export type EditPurchaseT = AddPurchaseT & {
  items: EditPurchaseItemT[];
};
