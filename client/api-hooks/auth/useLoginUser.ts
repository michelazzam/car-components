import { usePostData } from "@/api-service/usePostData";
import { setAccessToken } from "@/utils/auth-storage";
import { User } from "../users/use-list-users";

const useLoginUser = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) => {
  return usePostData<LoginUserData, ResponseData>({
    queryKeysToInvalidate: [["auth"]],
    endpoint: "/users/login",
    callBackOnSuccess: (data) => {
      callBackOnSuccess && callBackOnSuccess();
      setAccessToken(data.token); // This is now safe to call
    },
  });
};

export { useLoginUser };

type LoginUserData = {
  username: string;
  password: string;
};

// Define the type for permissions in each category

type ResponseData = {
  token: string;
  user: User;
};
