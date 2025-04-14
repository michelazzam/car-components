import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sendToApi } from "./api-methods";

export function useDeleteData({
  queryKeysToInvalidate,
  endpoint,
  hideSuccessToast = false,
  callBackOnSuccess,
}: {
  queryKeysToInvalidate?: QueryKey[];
  endpoint: string;
  hideSuccessToast?: boolean;
  callBackOnSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await sendToApi(endpoint, {}, "DELETE");
    },
    onSuccess: ({ message }) => {
      queryKeysToInvalidate &&
        queryKeysToInvalidate.forEach((key) =>
          queryClient.invalidateQueries({ queryKey: key })
        );

      !hideSuccessToast && toast.success(message);

      callBackOnSuccess && callBackOnSuccess();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
