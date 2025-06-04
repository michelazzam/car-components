import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";

export interface AddEditProductBodyParam {
  name: string;
  supplierId: string;
  note?: string;
  locationInStore?: string;
  cost: number;
  price: number;
  quantity: number;
  status?: string;
}

const useAddProduct = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) => {
  return usePostData<AddEditProductBodyParam>({
    queryKeysToInvalidate: [["products"]],
    endpoint: API.addProduct,
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useAddProduct };
