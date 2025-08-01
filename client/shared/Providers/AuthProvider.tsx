import { ReactNode, useEffect, useState } from "react";
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
import { getAccessToken, clearAccessToken } from "@/utils/auth-storage";
import { jwtDecode } from "jwt-decode";
import Spinner from "@/components/common/animations/Spinner";

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
  const router = useRouter();
  const pathname = usePathname();
  const [showLoading, setShowLoading] = useState(true);

  // Check if token is expired before making any API calls
  const isTokenValid = () => {
    const token = getAccessToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      if (!decoded || !decoded.exp) return false;

      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        clearAccessToken();
        return false;
      }

      return true;
    } catch (error) {
      clearAccessToken();
      return false;
    }
  };

  const shouldSkipAuth =
    pathname?.includes("/sign-in") || pathname?.includes("/no-license");
  const hasValidToken = isTokenValid();

  // Only enable auth check if we have a valid token or we're on a public route
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Only show loading on protected routes with valid token
    setShowLoading(hasValidToken && isLoading);
  }, [hasValidToken, isLoading]);

  const checkAccess = (
    requiredPermission: keyof Permissions | undefined
  ): boolean => {
    if (
      !isAuthenticated &&
      !pathname?.includes("sign-in") &&
      !pathname?.includes("no-license")
    ) {
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
    if (!shouldSkipAuth) {
      if (!hasValidToken) {
        console.log("Redirecting to /sign-in due to invalid or expired token");
        router.push("/sign-in");
        return;
      }

      if (!isLoading && !isAuthenticated) {
        console.log("Redirecting to /sign-in due to not authenticated");
        router.push("/sign-in");
        return;
      }
    }

    if (!isLoading && isAuthenticated) {
      const requiredPermission = pagePermissions.find(
        (p) => normalizePath(p.page) === normalizePath(pathname)
      )?.permission;

      if (!checkAccess(requiredPermission)) {
        console.log("Redirecting to / due to lack of access");
        router.push("/");
      }

      const extraPage = extraPagesPermissions.find(
        (p) => normalizePath(p.page) === normalizePath(pathname)
      );
      if (extraPage && !checkExtraPagesAccess(extraPage.roles)) {
        console.log("Redirecting to / due to lack of extra page access");
        router.push("/");
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    user,
    pathname,
    router,
    hasValidToken,
    shouldSkipAuth,
  ]);

  if (showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return children;
};

export default AuthProvider;
