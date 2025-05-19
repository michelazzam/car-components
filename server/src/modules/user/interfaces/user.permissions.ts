export const userPermissions = {
  Customers: {
    create: true,
    read: true,
    update: true,
  },
  Invoices: {
    create: true,
    read: true,
    update: true,
  },
  Inventory: {
    create: true,
    read: true,
    update: true,
  },
  Purchases: {
    create: true,
    read: true,
    update: true,
  },
  Services: {
    create: true,
    read: true,
    update: true,
  },
  Suppliers: {
    create: true,
    read: true,
    update: true,
  },
  Accounting: {
    create: true,
    read: true,
    update: true,
  },
  Organization: {
    create: true,
    read: true,
    update: true,
  },
  Expenses: {
    create: true,
    read: true,
    update: true,
  },
  VehicleMakes: {
    create: true,
    read: true,
    update: true,
  },
} as const;

// Type for the keys (resource names)
export type PermissionModuleName = keyof typeof userPermissions;

// Type for possible actions
export type PermissionModuleAction = 'create' | 'read' | 'update';
