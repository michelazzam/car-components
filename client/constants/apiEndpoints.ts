export const API = {
  // Users
  login: "/users/login", // POST
  listUsers: "/users", // GET
  userAuth: "/users/authenticate", // GET
  addUser: "/users",
  editUsers: (id: string) => `/users/${id}`, // PUT
  deleteUser: (id: string) => `/users/${id}`, // DELETE
  editUserPermissions: (id: string) => `/users/edit-permissions/${id}`, // PUT

  // Profile
  editProfile: `/users/edit-profile`, // PUT
  changePassword: "/users/change-password",

  // products
  listProducts: "/products", // GET
  addProduct: "/products", // POST
  editProduct: (id: string) => `/products/${id}`, // PUT
  deleteProduct: (id: string) => `/products/${id} `, // DELETE
  increaseStock: (id: string) => `/products/${id}/stock`, // PUT

  //Expenses
  listExpenses: "/expenses", //GET
  addExpense: "/expenses", // POST
  editExpense: (id: string) => `/expenses/${id}`,
  deleteExpense: (id: string) => `/expenses/${id} `, //DELETE

  // Expenses Type
  listExpensesType: "/expenseType", //GET
  addExpenseType: "/expenseType", //POST
  editExpenseType: (id: string) => `/expenseType/${id}`, //PUT
  deleteExpenseType: (id: string) => `/expenseType/${id}`, //DELETE

  // Gas Type
  listGasType: "/gasType",
  addGasType: "/gasType",
  editGasType: (id: string) => `/gasType/${id}`,
  deleteGasType: (id: string) => `/gasType/${id}`,

  // Vehicles
  listVehicles: "/vehicles", //GET
  addVehicle: "/vehicles", //POST
  editVehicle: (id: string) => `/vehicles/${id}`, //PUT
  deleteVehicle: (id: string) => `/vehicles/${id}`, //DELETE

  // Customers
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

  // Supplier:
  listSupplier: "/supplier", //GET
  addSupplier: "/supplier", //POST
  editSupplier: (id: string) => `/supplier/${id}`,
};
