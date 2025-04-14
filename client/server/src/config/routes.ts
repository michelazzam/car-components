import express, { Router } from "express";
import { userRoute } from "../modules/user/user.route.js";
import { accountingRoute } from "../modules/accounting/accounting.route.js";
import { productRoute } from "../modules/product/product.route.js";
import { organizationRoute } from "../modules/organization/organization.route.js";
import { expenseTypeRoute } from "../modules/expenseType/expenseType.route.js";
import { expenseRoute } from "../modules/expense/expense.route.js";
import { customerRoute } from "../modules/customer/customer.route.js";
import { vehicleRoute } from "../modules/vehicle/vehicle.route.js";
import { invoiceRoute } from "../modules/invoice/invoice.route.js";
import { reportsRoute } from "../modules/report/report.route.js";
import { gasTypeRoute } from "../modules/gasType/gasType.route.js";
import { dbBackupRoute } from "../modules/db-backup/db-backup.route.js";
import { serviceRoute } from "../modules/service/service.route.js";

const routes: {
  path: string;
  route: Router;
}[] = [
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/accounting",
    route: accountingRoute,
  },
  {
    path: "/products",
    route: productRoute,
  },
  {
    path: "/organization",
    route: organizationRoute,
  },
  {
    path: "/expenseType",
    route: expenseTypeRoute,
  },
  {
    path: "/expenses",
    route: expenseRoute,
  },
  {
    path: "/customers",
    route: customerRoute,
  },
  {
    path: "/vehicles",
    route: vehicleRoute,
  },
  {
    path: "/invoices",
    route: invoiceRoute,
  },
  {
    path: "/reports",
    route: reportsRoute,
  },
  {
    path: "/gasType",
    route: gasTypeRoute,
  },
  {
    path: "/db-backup",
    route: dbBackupRoute,
  },
  {
    path: "/services",
    route: serviceRoute,
  },
];

const router = express.Router();
routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
