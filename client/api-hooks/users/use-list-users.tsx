import { API } from "@/constants/apiEndpoints";
import { useReadData } from "../../api-service/useReadData";

export interface User {
  _id: string;
  // fullName: string;
  isActive: boolean;
  permissions: Permissions;
  username: string;
  role: UserRole | "superAmsAdmin";
  salary: number;
  email: string;
  phoneNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}
export type PermissionAction = {
  create: boolean;
  read: boolean;
  update: boolean;
};
export type Permissions = {
  Customers: PermissionAction;
  Invoices: PermissionAction;
  Inventory: PermissionAction;
  Purchases: PermissionAction;
  Services: PermissionAction;
  Suppliers: PermissionAction;
  Balance: PermissionAction;
  Organization: PermissionAction;
  Expenses: PermissionAction;
  Accounting:PermissionAction;
};

export const userRoles = [
  "user",
  "admin",
  "specialAccess",
  "superAmsAdmin",
] as const;
export type UserRole = (typeof userRoles)[number];

const useListUsers = () => {
  return useReadData<User[]>({
    queryKey: ["users"],
    endpoint: API.listUsers,
  });
};

export { useListUsers };
