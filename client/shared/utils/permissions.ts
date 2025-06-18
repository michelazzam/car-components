import { Permissions } from "@/api-hooks/users/use-list-users";

export const getPermission = (userPermissions: any, key: string) => {
  const perms = userPermissions as Record<string, any> | undefined;
  return (
    perms?.[key] ||
    perms?.[key.charAt(0).toUpperCase() + key.slice(1)] ||
    perms?.[key.toLowerCase()]
  );
};

export const normalizePath = (path: string) => path.replace(/\/+$/, "");

export const canAccess = (
  userPermissions: any,
  pagePermissions: { page: string; permission: keyof Permissions }[],
  path: string
) => {
  const requiredPermission = pagePermissions.find(
    (p) => normalizePath(p.page) === normalizePath(path)
  )?.permission;
  if (!requiredPermission) return true;
  const permissions = getPermission(
    userPermissions,
    String(requiredPermission)
  );
  return (
    permissions &&
    (permissions.create || permissions.read || permissions.update)
  );
};
