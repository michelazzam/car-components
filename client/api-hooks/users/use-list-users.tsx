import { API } from "@/constants/apiEndpoints";
import { useReadData } from "../../api-service/useReadData";

export interface User {
  _id: string;
  fullName: string;
  username: string;
  role: UserRole | "superAmsAdmin";
  phoneNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export const userRoles = ["employee", "admin"] as const;

export type UserRole = (typeof userRoles)[number];

const useListUsers = () => {
  return useReadData<User[]>({
    queryKey: ["users"],
    endpoint: API.listUsers,
  });
};

export { useListUsers };
