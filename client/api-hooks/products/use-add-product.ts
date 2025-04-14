import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";

export interface AddEditProductBodyParam {
  name: string;
  price: number;
  brand: string;
  cost: number;
  note?: string;
  stock: number;
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
