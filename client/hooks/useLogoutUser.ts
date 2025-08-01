import { clearAccessToken } from "@/utils/auth-storage";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { usePosStore } from "@/shared/store/usePosStore";
const useLogoutUser = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { clearPosStore } = usePosStore();
  const logout = () => {
    router.push("/sign-in");
    clearAccessToken();
    queryClient.clear();
    clearPosStore();
  };
  return logout;
};

export { useLogoutUser };
