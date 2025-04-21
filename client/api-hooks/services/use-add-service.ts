import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";
import { Service } from "./use-list-services";

export interface AddServiceBodyParam {
  name: string;
  price?:number
}

export const useAddService = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: (res: Service) => void;
}) => {
  return usePostData<AddServiceBodyParam, Service>({
    queryKeysToInvalidate: [["services"]],
    endpoint: API.createService,
    callBackOnSuccess: callBackOnSuccess,
  });
};
