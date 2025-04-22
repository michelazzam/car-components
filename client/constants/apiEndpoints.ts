export const API = {
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

  // Customers
  getCustomerById: (id: string) => `/customers/${id}`,
  listCustomers: "/customers",
  addCustomer: "/customers",
  editCustomer: (id: string) => `/customers/${id}`,
  deleteCustomer: (id: string) => `/customers/${id}`,
  addPayment: (id: string) => `/customers/pay-invoice/${id}`,

  //Invoices
  listInvoices: "/invoices",
  deleteInvoice: (id: string) => `/invoices/${id}`,
  addInvoice: "/invoices",
  editInvoice: (id: string) => `/invoices/${id}`,

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
  getUsdRate: "/accounting/usdRate",
  editUsdRate: "/accounting/usdRate",
  // Restaurant
  getOrganization: `/organization`, // GET
  editOrganization: `/organization`, // PUT

  // Orders
  listOrders: "/orders", // GET
  addOrder: "/orders", // POST
  closeOrder: (id: string) => `/orders/${id}/close`, // PUT
  deleteOrder: (id: string) => `orders/${id}`, // DELETE
  editOrder: (id: string) => `/orders/${id}`, // PUT

  //Reports
  getReportsByDate: "/reports", // GET
  getAllReports: "/reports/all", // GET

  // DB Backup:
  getDbBackupPath: "/db-backup/path", // GET
  updateDbBackupPath: "/db-backup/path", // PUT
  backupDB: "/db-backup/backup", // PUT

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
};
