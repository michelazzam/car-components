import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";
import { Supplier } from "./use-list-supplier";

const useAddSupplier = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) => {
  return usePostData<CreateSupplier>({
    queryKeysToInvalidate: [["suppliers"]],
    endpoint: API.addSupplier,
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useAddSupplier };

export type CreateSupplier = Omit<
  Supplier,
  "loan" | "createdAt" | "_id" | "__v"
>;
