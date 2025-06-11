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
const DashboardIcon = <i className="ri-file-chart-line side-menu__icon"></i>;
const BillingIcon = <i className="bx bx-receipt side-menu__icon"></i>;
const CarIcon = <i className="ri-car-line side-menu__icon"></i>;

const moneyIcon = (
  <i className="ri-money-dollar-circle-line side-menu__icon"></i>
);

const loanIcon = <i className="ri-bank-card-2-line side-menu__icon"></i>;

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
      icon: DashboardIcon,
      path: "/admin/dashboard",
      type: "link",
      active: pathname.startsWith("/admin/dashboard"),
      selected: pathname.startsWith("/admin/dashboard"),
      title: "Dashboard",
      visible: true,
      children: [],
    },
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
      icon: CarIcon,
      path: "/admin/makes",
      type: "link",
      active: pathname.startsWith("/admin/makes"),
      selected: pathname.startsWith("/admin/makes"),
      title: "Car Models",
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
      icon: BillingIcon,
      path: "/admin/payment-methods",
      type: "link",
      active: pathname.startsWith("/admin/payment-methods"),
      selected: pathname.startsWith("/admin/payment-methods"),
      title: "Payment Methods",
      children: [],
      visible: !(user?.role === "user"),
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
      icon: moneyIcon,
      path: "/admin/transactions",
      type: "link",
      active: pathname.startsWith("/admin/transactions"),
      selected: pathname.startsWith("/admin/transactions"),
      title: "Transactions",
      children: [],
      visible: user?.role === "superAmsAdmin",
    },
    {
      icon: loanIcon,
      path: "/admin/loan-transactions",
      type: "link",
      active: pathname.startsWith("/admin/loan-transactions"),
      selected: pathname.startsWith("/admin/loan-transactions"),
      title: "Loan Transactions",
      children: [],
      visible: user?.role === "superAmsAdmin",
    },

    {
      icon: BillingIcon,
      path: "/admin/ams/billing",
      type: "link",
      active: pathname.startsWith("/admin/ams/billing"),
      selected: pathname.startsWith("/admin/ams/billing"),
      title: "Billing",
      children: [],
      visible: !(user?.role === "user"),
    },
  ].filter((item) => item.visible);
}
