import UseAuth from "@/api-hooks/useAuth";
import { useRouter } from "next/router";
import { canAccess } from "@/shared/utils/permissions";
import { pagePermissions } from "@/shared/Providers/AuthProvider";
import { DASHBOARD_ROUTES } from "./dashboardRoutes";

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
  // if (user?.role === "user") {
  //   if (pathname !== "/sign-in" && pathname !== "/add-invoice") {
  //     router.push("/add-invoice");
  //   }
  // }

  return [
    {
      icon: DashboardIcon,
      path: DASHBOARD_ROUTES.dashboard,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.dashboard),
      selected: pathname.startsWith(DASHBOARD_ROUTES.dashboard),
      title: "Dashboard",
      visible: true,
      children: [],
    },
    {
      icon: FoodMenuIcon,
      path: DASHBOARD_ROUTES.addInvoice,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.addInvoice),
      selected: pathname === DASHBOARD_ROUTES.addInvoice,
      title: "Add Invoice",
      visible: true,
      children: [],
    },
    {
      icon: CustomerIcon,
      path: DASHBOARD_ROUTES.customers,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.customers),
      selected: pathname === DASHBOARD_ROUTES.customers,
      title: "Customers",
      visible: true,
      children: [],
    },
    {
      icon: SupplierIcon,
      path: DASHBOARD_ROUTES.suppliers,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.suppliers),
      selected: pathname.startsWith(DASHBOARD_ROUTES.suppliers),
      title: "Suppliers",
      children: [],
      visible: true,
    },
    {
      icon: PurchaseIcon,
      path: DASHBOARD_ROUTES.purchases,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.purchases),
      selected: pathname.startsWith(DASHBOARD_ROUTES.purchases),
      title: "Purchases",
      children: [],
      visible: true,
    },
    {
      icon: ArchiveIcon,
      path: DASHBOARD_ROUTES.expenses,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.expenses),
      selected: pathname.startsWith(DASHBOARD_ROUTES.expenses),
      title: "Expenses",
      visible: true,
      children: [],
    },
    {
      icon: InvoiceIcon,
      path: DASHBOARD_ROUTES.invoices,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.invoices),
      selected: pathname.startsWith(DASHBOARD_ROUTES.invoices),
      title: "Invoices",
      visible: true,
      children: [],
    },
    {
      icon: ArchiveIcon,
      path: DASHBOARD_ROUTES.inventory,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.inventory),
      selected: pathname.startsWith(DASHBOARD_ROUTES.inventory),
      title: "Inventory",
      visible: true,
      children: [],
    },
    {
      icon: ServicesIcon,
      path: DASHBOARD_ROUTES.services,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.services),
      selected: pathname.startsWith(DASHBOARD_ROUTES.services),
      title: "Services",
      visible: true,
      children: [],
    },
    {
      icon: CarIcon,
      path: DASHBOARD_ROUTES.makes,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.makes),
      selected: pathname.startsWith(DASHBOARD_ROUTES.makes),
      title: "Car Models",
      visible: true,
      children: [],
    },
    {
      icon: BalanceIcon,
      path: DASHBOARD_ROUTES.balance,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.balance),
      selected: pathname.startsWith(DASHBOARD_ROUTES.balance),
      title: "Balance",
      visible: true,
      children: [],
    },
    {
      icon: UserIcon,
      path: DASHBOARD_ROUTES.users,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.users),
      selected: pathname.startsWith(DASHBOARD_ROUTES.users),
      title: "Users",
      visible:
        user?.role === "superAmsAdmin" ||
        user?.role === "admin" ||
        user?.role === "specialAccess",
      children: [],
    },
    {
      icon: BillingIcon,
      path: DASHBOARD_ROUTES.paymentMethods,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.paymentMethods),
      selected: pathname.startsWith(DASHBOARD_ROUTES.paymentMethods),
      title: "Payment Methods",
      children: [],
      visible: !(user?.role === "user"),
    },

    {
      icon: SettingsIcon,
      path: DASHBOARD_ROUTES.settings,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.settings),
      selected: pathname.startsWith(DASHBOARD_ROUTES.settings),
      title: "Settings",
      visible: true,
      children: [],
    },
    {
      icon: DBBackupIcon,
      path: DASHBOARD_ROUTES.dbBackup,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.dbBackup),
      selected: pathname.startsWith(DASHBOARD_ROUTES.dbBackup),
      title: "DB Backup",
      children: [],
      visible: user?.role === "superAmsAdmin",
    },
    {
      icon: moneyIcon,
      path: DASHBOARD_ROUTES.transactions,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.transactions),
      selected: pathname.startsWith(DASHBOARD_ROUTES.transactions),
      title: "Transactions",
      children: [],
      visible: user?.role === "superAmsAdmin",
    },
    {
      icon: loanIcon,
      path: DASHBOARD_ROUTES.loanTransactions,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.loanTransactions),
      selected: pathname.startsWith(DASHBOARD_ROUTES.loanTransactions),
      title: "Loan Transactions",
      children: [],
      visible: user?.role === "superAmsAdmin",
    },

    {
      icon: BillingIcon,
      path: DASHBOARD_ROUTES.billing,
      type: "link",
      active: pathname.startsWith(DASHBOARD_ROUTES.billing),
      selected: pathname.startsWith(DASHBOARD_ROUTES.billing),
      title: "Billing",
      children: [],
      visible: !(user?.role === "user"),
    },
  ].filter(
    (item) =>
      item.visible && canAccess(user?.permissions, pagePermissions, item.path)
  );
}
