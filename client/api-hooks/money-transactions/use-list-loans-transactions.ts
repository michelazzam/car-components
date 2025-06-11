import { useReadData } from "@/api-service/useReadData";
import { Pagination } from "@/components/admin/Pagination";
import { API } from "@/constants/apiEndpoints";
import { Customer } from "../customer/use-list-customer";
import { Supplier } from "../supplier/use-list-supplier";
import { Expense } from "../expenses/use_list_expenses";
import { Invoice } from "../invoices/useListInvoices";
export const useListLoansTransactions = (params: {
  pageIndex: number;
  pageSize: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  supplierId?: string;
  customerId?: string;
}) => {
  return useReadData<LoanTransactionsResponse>({
    queryKey: ["customer-transactions", JSON.stringify(params)],
    endpoint: API.listLoansTransactions,
    params,
  });
};

interface LoanTransactionsResponse {
  transactions: LoanTransaction[];
  pagination: Pagination;
}
export interface LoanTransaction {
  _id: string;
  type:
    | "new-invoice"
    | "pay-invoice-loan"
    | "new-purchase"
    | "pay-purchase-loan";
  customer: Customer | null;
  supplier: Supplier | null;
  amount: number;
  loanRemaining: number;
  expense: Expense | null;
  invoice: Invoice | null;
  createdAt: string;
  updatedAt: string;
  number: number;
}
