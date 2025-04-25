import UseAuth from "@/api-hooks/useAuth";
import { useRouter } from "next/router";

const FoodMenuIcon = <i className="bx bx-food-menu side-menu__icon"></i>;
const ArchiveIcon = <i className="bx bx-archive side-menu__icon"></i>;
const CustomerIcon = <i className="bx bx-user side-menu__icon"></i>;
const SettingsIcon = <i className="bx bx-cog side-menu__icon"></i>;
const UserIcon = <i className="ri-user-follow-fill side-menu__icon"></i>;
const InvoiceIcon = <i className="ri-file-list-3-line side-menu__icon"></i>;
const BalanceIcon = <i className="ri-scales-fill side-menu__icon"></i>;
const DBBackupIcon = <i className="fe fe-database side-menu__icon"></i>;
const SupplierIcon = <i className="fe fe-truck side-menu__icon"></i>;
const ServicesIcon = <i className="ri-service-line side-menu__icon"></i>;
const PurchaseIcon = <i className="ri-shopping-bag-line side-menu__icon"></i>;
export default function useMenuItems() {
  const { user } = UseAuth();

  const router = useRouter();
  const pathname = router.pathname;
  if (user?.role === "user") {
    if (pathname !== "/sign-in" && pathname !== "/add-invoice") {
      router.push("/add-invoice");
    }
  }

  return [
    {
      icon: FoodMenuIcon,
      path: "/add-invoice",
      type: "link",
      active: pathname.startsWith("/add-invoice"),
      selected: pathname === "/add-invoice",
      title: "Add Invoice",
      visible: true,
      children: [],
    },
    {
      icon: UserIcon,
      path: "/admin/users",
      type: "link",
      active: pathname.startsWith("/admin/users"),
      selected: pathname.startsWith("/admin/users"),
      title: "Users",
      visible: true,
      children: [],
    },
    {
      icon: SupplierIcon,
      path: "/admin/supplier",
      type: "link",
      active: pathname.startsWith("/admin/supplier"),
      selected: pathname.startsWith("/admin/supplier"),
      title: "Suppliers",
      children: [],
      visible: true,
    },
    {
      icon: CustomerIcon,
      path: "/admin/customers",
      type: "link",
      active: pathname.startsWith("/admin/customers"),
      selected: pathname === "/admin/customers",
      title: "Customers",
      visible: true,
      children: [],
    },
    {
      icon: InvoiceIcon,
      path: "/admin/invoices",
      type: "link",
      active: pathname.startsWith("/admin/invoices"),
      selected: pathname.startsWith("/admin/invoices"),
      title: "Invoices",
      visible: true,
      children: [],
    },
    {
      icon: ArchiveIcon,
      path: "/admin/inventory",
      type: "link",
      active: pathname.startsWith("/admin/inventory"),
      selected: pathname.startsWith("/admin/inventory"),
      title: "Inventory",
      visible: true,
      children: [],
    },
    {
      icon: PurchaseIcon,
      path: "/admin/purchase",
      type: "link",
      active: pathname.startsWith("/admin/purchase"),
      selected: pathname.startsWith("/admin/purchase"),
      title: "Purchases",
      children: [],
      visible: true,
    },
    {
      icon: ServicesIcon,
      path: "/admin/services",
      type: "link",
      active: pathname.startsWith("/admin/services"),
      selected: pathname.startsWith("/admin/services"),
      title: "Services",
      visible: true,
      children: [],
    },
    {
      icon: ArchiveIcon,
      path: "/admin/expenses",
      type: "link",
      active: pathname.startsWith("/admin/expenses"),
      selected: pathname.startsWith("/admin/expenses"),
      title: "Expenses",
      visible: true,
      children: [],
    },
    {
      icon: BalanceIcon,
      path: "/admin/balance",
      type: "link",
      active: pathname.startsWith("/admin/balance"),
      selected: pathname.startsWith("/admin/balance"),
      title: "Balance",
      visible: true,
      children: [],
    },
    {
      icon: DBBackupIcon,
      path: "/admin/db-backup",
      type: "link",
      active: pathname.startsWith("/admin/db-backup"),
      selected: pathname.startsWith("/admin/db-backup"),
      title: "DB Backup",
      children: [],
      visible: user?.role === "superAmsAdmin",
    },
    {
      icon: SettingsIcon,
      path: "/admin/settings",
      type: "link",
      active: pathname.startsWith("/admin/settings"),
      selected: pathname.startsWith("/admin/settings"),
      title: "Settings",
      visible: true,
      children: [],
    },
  ].filter((item) => item.visible);
}
