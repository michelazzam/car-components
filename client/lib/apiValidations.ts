import { z } from "zod";
import { itemStatuses } from "./constants/item";

const loginSchema = z.object({
  username: z.string().min(1, "Required"),
  password: z.string().min(5, "Length > 5"),
});

const UserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        val === "" ||
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      {
        message: "Invalid email format",
      }
    ),
  password: z.string().optional(),
  salary: z.number(),
  role: z.string().min(1, "Role is required"),
});

const EditUserPermissions = z.object({
  Customers: z
    .object({
      create: z.boolean().optional(),
      update: z.boolean().optional(),
      read: z.boolean().optional(),
    })
    .optional(),
  Invoices: z
    .object({
      create: z.boolean().optional(),
      update: z.boolean().optional(),
      read: z.boolean().optional(),
    })
    .optional(),
  Inventory: z
    .object({
      create: z.boolean().optional(),
      update: z.boolean().optional(),
      read: z.boolean().optional(),
    })
    .optional(),
  Purchases: z
    .object({
      create: z.boolean().optional(),
      update: z.boolean().optional(),
      read: z.boolean().optional(),
    })
    .optional(),
  Services: z
    .object({
      create: z.boolean().optional(),
      update: z.boolean().optional(),
      read: z.boolean().optional(),
    })
    .optional(),
  Suppliers: z
    .object({
      create: z.boolean().optional(),
      update: z.boolean().optional(),
      read: z.boolean().optional(),
    })
    .optional(),
  Organization: z
    .object({
      create: z.boolean().optional(),
      update: z.boolean().optional(),
      read: z.boolean().optional(),
    })
    .optional(),
  Expenses: z
    .object({
      create: z.boolean().optional(),
      update: z.boolean().optional(),
      read: z.boolean().optional(),
    })
    .optional(),
  Accounting: z
    .object({
      create: z.boolean().optional(),
      update: z.boolean().optional(),
      read: z.boolean().optional(),
    })
    .optional(),
  Balance: z
    .object({
      create: z.boolean().optional(),
      update: z.boolean().optional(),
      read: z.boolean().optional(),
    })
    .optional(),
});

const ProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().min(1, "Username is required"),
  phoneNumber: z
    .string()
    .min(11, "Phone number must be at least 11 characters long")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters long")
    .optional()
    .or(z.literal("")),
});
export type ProfileSchema = z.infer<typeof ProfileSchema>;

const ChangePassword = z.object({
  currentPassword: z
    .string()
    .min(5, "Current password must be greater than 5 characters"),
  //current password should be different than new password
  newPassword: z
    .string()
    .min(5, "New password must be greater than 5 characters"),
});

export type ChangePassword = z.infer<typeof ChangePassword>;

export type AddUserSchema = z.infer<typeof UserSchema>;

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  supplierId: z.string().min(1, "Name is required"),
  price: z.number().min(1, "Price is required"),
  cost: z.number(),
  quantity: z.number(),
  status: z.enum(itemStatuses),
});
export type ProductSchema = z.infer<typeof ProductSchema>;

//-------------PURCHASE
const AddPurchaseItemSchema = z.object({
  itemId: z.string().min(1, { message: "Please select a product" }),
  description: z.string(),
  name: z.string().optional(),
  price: z.number(),
  quantity: z.number(),
  quantityFree: z.number(),
  discount: z.number(),
  lotNumber: z.string(),
  expDate: z.string(),
  totalPrice: z.number(),
  supplier: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .optional(),
});
export type AddPurchaseItemSchemaType = z.infer<typeof AddPurchaseItemSchema>;

const AddPurchaseSchema = z.object({
  supplierId: z.string().min(1, { message: "required" }),
  invoiceDate: z.string().min(1, { message: "required" }),
  invoiceNumber: z.string().min(1, { message: "required" }),
  customerConsultant: z.string().min(1, { message: "required" }),
  phoneNumber: z.string().min(1, { message: "required" }),
  vatPercent: z.number().min(0),
  vatLBP: z.number().min(0),
  totalAmount: z.number().optional(),
  amountPaid: z.number().min(0),
  items: z.array(AddPurchaseItemSchema).optional(),
});
export type AddPurchaseSchemaType = z.infer<typeof AddPurchaseSchema>;

//-------------SERVICE
const ServiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().optional(),
});
export type ServiceSchema = z.infer<typeof ServiceSchema>;

const PrinterSchema = z.object({
  name: z.string().min(1, "Name must be at least 3 characters"),
  ipAddress: z.string().ip("IP Address must be in the format of xxx.xxx.x.x"),
});
export type PrinterSchema = z.infer<typeof PrinterSchema>;

const CategorySchema = z.object({
  name: z.string().min(1, "Name must be at least 3 characters"),
});
export type CategorySchema = z.infer<typeof CategorySchema>;
const SupplierSchema = z.object({
  name: z.string().min(1, "Supplier Name is required"),
  capital: z.string().optional(),
  poBox: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  fax: z.string().optional(),
  ext: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  vatNumber: z.string().optional(),
  extraInfo: z.string().optional(),
});
export type SupplierSchema = z.infer<typeof SupplierSchema>;

// Organization
const OrganizationSchema = z.object({
  name: z.string().min(1, "Name must be at least 3 characters"),
  address: z.string().min(1, "Address must be at least 3 characters"),
  email: z.string().email("Email is invalid"),
  phoneNumber: z.string().min(11, "Phone number must be at least 3 characters"),
  tvaNumber: z.string().min(1, "TVA number must be at least 3 characters"),
  tvaPercentage: z
    .number()
    .min(0, "TVA percentage must be at least 0")
    .max(100, "TVA percentage must be less than 100"),
});
export type OrganizationSchema = z.infer<typeof OrganizationSchema>;

const IncreaseStockSchema = z.object({
  amount: z.number().min(1, "Amount should be greater than 0"),
});
export type IncreaseStockSchema = z.infer<typeof IncreaseStockSchema>;

const ExpenseSchema = z.object({
  expenseTypeId: z.string().min(1, "Expense type is required"),
  amount: z.number().min(0, "Amount is required"),
  date: z.string().min(1, "Date is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  note: z.string().optional(),
});
export type ExpenseSchemaType = z.infer<typeof ExpenseSchema>;

const ExpenseTypeSchema = z.object({
  name: z.string().min(1, "title is required"),
});

const VehicleSchema = z.object({
  make: z.string().min(1, "make is required"),
  model: z.string().min(1, "model is required"),
  odometer: z.number().nonnegative().optional(),
  number: z.string().min(1, "number is required"),
});
export type VehicleSchema = z.infer<typeof VehicleSchema>;

const CustomerSchema = z.object({
  name: z.string().min(1, "name is required"),
  phoneNumber: z.string().min(11, "phone number is required"),
  address: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        val === "" ||
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      {
        message: "Invalid email format",
      }
    ),
  note: z.string().optional(),
  tvaNumber: z.string().optional(),
});

const AddPaymentSchema = z
  .object({
    amountPaidUsd: z.number().min(0, "Amount paid in USD is required"),
    amountPaidLbp: z.number().min(0, "Amount paid in LBP is required"),
  })
  .refine((data) => data.amountPaidUsd > 0 || data.amountPaidLbp > 0, {
    path: ["payment"], // Custom path that you will check in your component
    message: "Either Amount paid in USD or LBP must be greater than 0",
  });

export type AddPaymentSchema = z.infer<typeof AddPaymentSchema>;
export type CustomerSchema = z.infer<typeof CustomerSchema>;
// Add Invoice Schema
const AddInvoiceSchema = z
  .object({
    invoiceNumber: z.number().optional(),
    driverName: z.string().optional(),
    discount: z.object({
      amount: z.number().min(0, "Discount amount cannot be negative"),
      type: z.string().min(1, "Discount type is required"),
    }),
    paidAmountUsd: z.number().min(0, "Amount paid in USD cannot be negative"),
    customerId: z.string().min(1, "Customer ID is required"),
    customer: z
      .object({
        label: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        tvaNumber: z.string().optional(),
      })
      .optional(),
    vehicle: z
      .object({
        vehicleNb: z.string().optional(),
        model: z.string().optional(),
      })
      .optional(),

    isPaid: z.boolean(),
    hasVehicle: z.boolean(),
    vehicleId: z.string().optional(),
    products: z
      .array(
        z.object({
          productId: z.string().min(1, "Product ID is required"),
          quantity: z.number().min(1, "Quantity must be at least 1"),
          price: z.number().min(0, "Price must be non-negative"),
        })
      )
      .optional(),
    services: z
      .array(
        z.object({
          name: z.string().min(1, "Service name is required"),
          quantity: z.number().min(1, "Quantity must be at least 1"),
          price: z.number().min(0, "Price must be non-negative"),
        })
      )
      .optional(),
    items: z.array(
      z.object({
        itemRef: z.string().optional(),
        serviceRef: z.string().optional(),
        quantity: z.number(),
        discount: z
          .object({
            amount: z.number(),
            type: z.string(),
          })
          .optional(),
        subTotal: z.number(),
        totalPrice: z.number(),
      })
    ).optional(),
    subTotalUsd:z.number(),
    totalUsd:z.number(),
    generalNote: z.string().optional(),
    customerNote: z.string().optional(),
    type:z.enum(["s1","s2"])
  })
  .refine(
    (data) => {
      if (data.hasVehicle && !data.vehicleId) {
        return false; // Fail validation if vehicle is required but not provided
      }
      return true;
    },
    {
      message: "Vehicle ID is required.",
      path: ["vehicleId"],
    }
  )
  .refine(
    (data) => {
      console.log("Data:", data);

      // Calculate the sum of products (quantity * price)
      const productTotal =
        data.products?.reduce(
          (sum, product) => sum + product.quantity * product.price,
          0
        ) || 0;

      console.log("Product Total:", productTotal);

      // Calculate the sum of services (quantity * price)
      const serviceTotal =
        data.services?.reduce(
          (sum, service) => sum + service.quantity * service.price,
          0
        ) || 0;

      console.log("Service Total:", serviceTotal);

      const total = productTotal + serviceTotal;
      console.log("Total:", total);

      if (data.discount.type === "fixed") {
        return data.discount.amount <= total; // This should return false if invalid
      } else {
        return data.discount.amount >= 0 && data.discount.amount <= 100;
      }
    },
    {
      message: `Discount amount is not valid`,
      path: ["discount", "amount"],
    }
  );
export type AddInvoiceSchema = z.infer<typeof AddInvoiceSchema>;

const DBBackupPath = z.object({
  path: z.string().min(1, "Path is required"),
});
export type DBBackupPath = z.infer<typeof DBBackupPath>;

export const apiValidations = {
  Login: loginSchema,
  AddUser: UserSchema,
  AddEditProduct: ProductSchema,
  AddEditService: ServiceSchema,
  AddEditPrinter: PrinterSchema,
  AddEditCategory: CategorySchema,
  changePassword: ChangePassword,
  EditOrganization: OrganizationSchema,
  IncreaseStock: IncreaseStockSchema,
  AddExpense: ExpenseSchema,
  VehicleSchema: VehicleSchema,
  CustomerSchema: CustomerSchema,
  AddPaymentSchema: AddPaymentSchema,
  ProfileSchema: ProfileSchema,
  AddInvoiceSchema: AddInvoiceSchema,
  AddExpenseType: ExpenseTypeSchema,
  AddPurchaseSchema: AddPurchaseSchema,
  AddPurchaseItemSchema,
  DBBackupPath,
  AddEditSupplier: SupplierSchema,
  EditUserPermissions: EditUserPermissions,
};
