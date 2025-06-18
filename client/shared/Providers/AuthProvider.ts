import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "@/api-hooks/useAuth";
import {
  Permissions,
  PermissionsEnum,
  UserRole,
} from "@/api-hooks/users/use-list-users";
import { usePathname } from "next/navigation";
import { DASHBOARD_ROUTES } from "../layout-components/sidebar/dashboardRoutes";
import { getPermission, normalizePath } from "@/shared/utils/permissions";

interface PagePermission {
  permission: keyof Permissions;
  page: string;
  title: string;
}

export const pagePermissions: PagePermission[] = [
  {
    permission: PermissionsEnum.Customers,
    page: DASHBOARD_ROUTES.customers,
    title: "Customers",
  },
  {
    permission: PermissionsEnum.Invoices,
    page: DASHBOARD_ROUTES.invoices,
    title: "Invoices",
  },
  {
    permission: PermissionsEnum.Inventory,
    page: DASHBOARD_ROUTES.inventory,
    title: "Inventory",
  },
  {
    permission: PermissionsEnum.Purchases,
    page: DASHBOARD_ROUTES.purchases,
    title: "Purchases",
  },
  {
    permission: PermissionsEnum.Services,
    page: DASHBOARD_ROUTES.services,
    title: "Services",
  },
  {
    permission: PermissionsEnum.Suppliers,
    page: DASHBOARD_ROUTES.suppliers,
    title: "Suppliers",
  },
  {
    permission: PermissionsEnum.Organization,
    page: DASHBOARD_ROUTES.settings,
    title: "Settings",
  },
  {
    permission: PermissionsEnum.Expenses,
    page: DASHBOARD_ROUTES.expenses,
    title: "Expenses",
  },
  {
    permission: PermissionsEnum.Accounting,
    page: DASHBOARD_ROUTES.balance,
    title: "Balance",
  },
  {
    permission: PermissionsEnum.VehicleMakes,
    page: DASHBOARD_ROUTES.makes,
    title: "Makes",
  },
];
export const extraPagesPermissions: {
  page: string;
  title: string;
  roles: UserRole[];
}[] = [
  {
    page: "/admin/waste-products/",
    title: "Waste",
    roles: ["admin", "specialAccess", "superAmsAdmin"],
  },
];

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const checkAccess = (
    requiredPermission: keyof Permissions | undefined
  ): boolean => {
    if (!isAuthenticated && !pathname?.includes("sign-in")) {
      return false;
    }
    if (!requiredPermission) {
      return true; // No specific permission required
    }
    const permissions = getPermission(
      user?.permissions,
      String(requiredPermission)
    );
    const returnedValue =
      (permissions &&
        (permissions.create || permissions.read || permissions.update)) ||
      false;
    console.log("returnedValue", returnedValue);
    return returnedValue;
  };

  const checkExtraPagesAccess = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user?.role);
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !pathname?.includes("/sign-in")) {
      console.log("Redirecting to /sign-in due to not authenticated");
      router.push("/sign-in");
      return;
    }
    if (!isLoading && isAuthenticated) {
      //----CHECK IF IM IN REQUIRED PAGES ( with predefined permissions )
      const requiredPermission = pagePermissions.find(
        (p) => normalizePath(p.page) === normalizePath(pathname)
      )?.permission;

      if (!checkAccess(requiredPermission)) {
        console.log("Redirecting to / due to lack of access");
        router.push("/");
      }

      //----CHECK IF IM IN EXTRA PAGES
      const extraPage = extraPagesPermissions.find(
        (p) => normalizePath(p.page) === normalizePath(pathname)
      );
      if (extraPage && !checkExtraPagesAccess(extraPage.roles)) {
        console.log("Redirecting to / due to lack of extra page access");
        router.push("/");
      }
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  return children;
};

export default AuthProvider;
