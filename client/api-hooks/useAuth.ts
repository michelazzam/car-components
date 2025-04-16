import { useReadData } from "../api-service/useReadData";
import { getAccessToken, setAccessToken } from "@/utils/auth-storage";
import { User } from "@/api-hooks/users/use-list-users";
import { API } from "@/constants/apiEndpoints";
import { useEffect } from "react";

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

  // update token in local storage
  useEffect(() => {
    if (data?.token) {
      setAccessToken(data.token);
    }
  }, [data]);

  return {
    user: data?.user,
    isAuthenticated: !!data?.user,
    isLoading,
    refetch,
  };
}
