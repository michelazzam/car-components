import {
  type QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sendToApi } from "./api-methods";

export function useUpdateData<BodyParams, ResponseData = unknown>({
  queryKeysToInvalidate,
  endpoint,
  hideSuccessToast = false,
  callBackOnSuccess,
}: {
  queryKeysToInvalidate?: QueryKey[];
  endpoint: string;
  hideSuccessToast?: boolean;
  callBackOnSuccess?: (data: ResponseData) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BodyParams) => sendToApi(endpoint, data, "PUT"),
    onSuccess: ({ data, message }) => {
      queryKeysToInvalidate &&
        queryKeysToInvalidate.forEach((key) =>
          queryClient.invalidateQueries({ queryKey: key })
        );

      !hideSuccessToast && toast.success(message);

      callBackOnSuccess && callBackOnSuccess(data);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
