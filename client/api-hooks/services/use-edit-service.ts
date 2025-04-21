import { API } from "@/constants/apiEndpoints";
import { useUpdateData } from "@/api-service/useUpdateData";
import { AddServiceBodyParam } from "./use-add-service";

const useEditService = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<AddServiceBodyParam>({
    queryKeysToInvalidate: [["services"]],
    endpoint: API.editService(id),
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useEditService };
