export const API = {
  //Money Transactions
  listLoansTransactions: "/loans-transactions",

  // Users
  login: "/users/login", // POST
  listUsers: "/users", // GET
  userAuth: "/users/authenticate", // GET
  addUser: "/users/add", // POST
  editUser: (id: string) => `/users/edit/${id}`, // PUT
  deleteUser: (id: string) => `/users/delete/${id}`, // DELETE
  editUserPermissions: (id: string) => `/users/edit-permissions/${id}`, // PUT

  // Profile
  editProfile: `/users/edit-profile`, // PUT
  changePassword: "/users/change-password",

  // products
  listProducts: "/items", // GET
  addProduct: "/items", // POST
  editProduct: (id: string) => `/items/${id}`, // PUT
  deleteProduct: (id: string) => `/items/${id} `, // DELETE
  increaseStock: (id: string) => `/items/${id}/stock`, // PUT
  getProductById: (id: string) => `/items/${id}`, // GET

  //purchase
  listPurchase: "/purchase",
  addPurchase: "/purchase",
  editPurchase: (id: string) => `/purchase/${id}`,
  deletePurchase: (id: string) => `/purchase/${id}`,

  //Expenses
  listExpenses: "/expense", //GET
  addExpense: "/expense", // POST
  editExpense: (id: string) => `/expense/${id}`,
  deleteExpense: (id: string) => `/expense/${id} `, //DELETE

  // Expenses Type
  listExpensesType: "/expense-type", //GET
  addExpenseType: "/expense-type", //POST
  editExpenseType: (id: string) => `/expense-type/${id}`, //PUT
  deleteExpenseType: (id: string) => `/expense-type/${id}`, //DELETE

  // Gas Type
  listGasType: "/gasType",
  addGasType: "/gasType",
  editGasType: (id: string) => `/gasType/${id}`,
  deleteGasType: (id: string) => `/gasType/${id}`,

  // Vehicles
  listVehicles: `/customers/vehicle`, //GET
  addVehicle: (customerId: string) => `/customers/${customerId}/vehicle`, //POST
  editVehicle: (vehicleId: string, customerId: string) =>
    `/customers/${customerId}/vehicle/${vehicleId}`, //PUT
  deleteVehicle: (vehicleId: string, customerId: string) =>
    `/customers/${customerId}/vehicle/${vehicleId}`, //DELETE

  // Makes
  addMake: "/makes", //POST✅
  listMakes: "/makes", //GET ✅
  editMake: (makeId: string) => `/makes/${makeId}`, //PUT✅
  deleteMake: (makeId: string) => `/makes/${makeId}`, // DELETE✅

  //MODELS
  addModelByMakeId: (makeId: string) => `/makes/models/${makeId}`, //POST✅
  singleMake: (makeId: string) => `/makes/models/${makeId}`, //GET

  editModel: (makeId: string, modelId: string) =>
    `/makes/models/${makeId}/${modelId}`, //PUT✅
  deleteModel: (makeId: string, modelId: string) =>
    `/makes/models/${makeId}/${modelId}`, //DELETE ✅

  // Customers
  getCustomerById: (id: string) => `/customers/${id}`,
  listCustomers: "/customers",
  addCustomer: "/customers",
  editCustomer: (id: string) => `/customers/${id}`,
  deleteCustomer: (id: string) => `/customers/${id}`,

  //Invoices
  listInvoices: "/invoices",
  deleteInvoice: (id: string) => `/invoices/${id}`,
  addInvoice: "/invoices",
  editInvoice: (id: string) => `/invoices/${id}`,
  addPayment: `/invoices/pay-customer-invoices`, // PUT

  // categories
  listCategory: "/categories", // GET
  addCategory: "/categories", // POST
  editCategory: (id: string) => `/categories/${id}`, // PUT
  deleteCategory: (id: string) => `/categories/${id}`, // DELETE

  //printers
  listPrinters: "/printers", // GET
  addPrinter: "/printers", // POST
  editPrinter: (id: string) => `/printers/${id}`, // PUT
  deletePrinter: (id: string) => `/printers/${id}`, // DELETE

  //usdRate
  getUsdRate: "/accounting/usd-rate",
  editUsdRate: "/accounting/usd-rate",

  //caisse
  closeCaisse: "/caisse/close-caisse",
  openCaisse: "/caisse/open-caisse",
  getCaisse: "/caisse",
  listCaisse: "/caisse/history",

  // Restaurant
  getOrganization: `/organization`, // GET
  editOrganization: `/organization/update`, // PUT

  // Orders
  listOrders: "/orders", // GET
  addOrder: "/orders", // POST
  closeOrder: (id: string) => `/orders/${id}/close`, // PUT
  deleteOrder: (id: string) => `orders/${id}`, // DELETE
  editOrder: (id: string) => `/orders/${id}`, // PUT

  //Reports
  getAccountSummary: "reports/accounts-receivable-summary",
  getReportsByDate: "/reports/sum", // GET
  getAllReports: "/reports/all", // GET
  getGlobalReports: "/reports/global", // GET
  // DB Backup:
  getDbBackupPath: "/backup/path", // GET
  updateDbBackupPath: "/backup/path", // PUT
  backupDB: "/backup/trigger-backup", // POST

  // Service:
  getAllServices: "/services", // GET
  createService: "/services", // POST
  editService: (id: string) => `/services/${id}`, //PUT
  deleteService: (id: string) => `/services/${id}`, //DELETE

  // Supplier:
  listSupplier: "/suppliers", //GET
  addSupplier: "/suppliers", //POST
  getSingleSupplier: (id: string) => `/suppliers/${id}`, //GET
  editSupplier: (id: string) => `/suppliers/${id}`, //PUT
  deleteSupplier: (id: string) => `/suppliers/${id}`, //DELETE

  //Payment method:
  listPaymentMethod: "/payment-methods", //GET
  addPaymentMethod: "/payment-methods", //POST
  editPaymentMethod: (id: string) => `/payment-methods/${id}`, //PUT
  deletePaymentMethod: (id: string) => `/payment-methods/${id}`, //DELETE

  // ams:
  getBilling: "/app-token/billing",
  checkLicense: "/app-token/validate",
  validateLicense: "/app-token/validate",

  getTransactions: "/transactions",
};
