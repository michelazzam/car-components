import { useDeleteData } from "@/api-service/useDeleteData";
import { API } from "@/constants/apiEndpoints";

export const useDeleteMake = ({
  makeId,
  callBackOnSuccess,
}: {
  makeId: string;
  callBackOnSuccess?: () => void;
}) => {
  return useDeleteData({
    endpoint: API.deleteMake(makeId),
    callBackOnSuccess,
    queryKeysToInvalidate: [["makes"]],
  });
};
