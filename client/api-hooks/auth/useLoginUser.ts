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
    hideSuccessToast: true,
    callBackOnSuccess: (data) => {
      callBackOnSuccess && callBackOnSuccess();
      setAccessToken(data.accessToken);
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
  accessToken: string;
  userData: User;
};
