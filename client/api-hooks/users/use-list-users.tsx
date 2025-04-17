import { API } from "@/constants/apiEndpoints";
import { useReadData } from "../../api-service/useReadData";

export interface User {
  _id: string;
  // fullName: string;
  isActive: boolean;
  permissions: Permissions;
  username: string;
  role: UserRole | "superAmsAdmin";
  phoneNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}
type PermissionAction = {
  create: boolean;
  read: boolean;
  update: boolean;
};
type Permissions = {
  Customers: PermissionAction;
  Invoices: PermissionAction;
  Inventory: PermissionAction;
  Purchases: PermissionAction;
  Services: PermissionAction;
  Suppliers: PermissionAction;
  Balance: PermissionAction;
  Organization: PermissionAction;
  Expenses: PermissionAction;
};

export const userRoles = ["employee", "admin"] as const;

export type UserRole = (typeof userRoles)[number];

const useListUsers = () => {
  return useReadData<User[]>({
    queryKey: ["users"],
    endpoint: API.listUsers,
  });
};

export { useListUsers };
