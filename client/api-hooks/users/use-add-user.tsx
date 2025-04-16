import { API } from "@/constants/apiEndpoints";
import { usePostData } from "../../api-service/usePostData";
import { AddUserSchema } from "@/lib/apiValidations";

export const useAddUser = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) =>
  usePostData<AddUserSchema>({
    endpoint: API.addUser,
    queryKeysToInvalidate: [["users"]],
    callBackOnSuccess,
  });
