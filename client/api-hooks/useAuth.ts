import { useReadData } from "../api-service/useReadData";
import { getAccessToken } from "@/utils/auth-storage";
import { User } from "@/api-hooks/users/use-list-users";
import { API } from "@/constants/apiEndpoints";

export default function UseAuth() {
  const accessToken = getAccessToken();

  const { data, isLoading, refetch } = useReadData<{
    user: User;
    token: string;
  }>({
    queryKey: ["auth"],
    endpoint: API.userAuth,
    retry: false,
    enabled: !!accessToken,
  });

  return {
    user: data?.user,
    isAuthenticated: !!data?.user,
    isLoading,
    refetch,
  };
}
