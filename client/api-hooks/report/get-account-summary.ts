// GET /v1/reports/accounts-receivable-summary

import { useReadData } from "@/api-service/useReadData";
import { Pagination } from "@/components/admin/Pagination";
import { API } from "@/constants/apiEndpoints";

export interface CustomerAccount {
  customerName: string;
  invoiceAmount: number;
  amountPaid: number;
  outstandingAmount: number;
}

export interface Totals {
  totalInvoiceAmount: number;
  totalAmountPaid: number;
  totalOutstandingAmount: number;
}

interface AccountResponse {
  rows: CustomerAccount[];
  totals: Totals;
  pagination: Pagination;
}

export function useGetAccountReports(params: {
  startDate?: string;
  endDate?: string;
  pageIndex?: number;
  pageSize?: number;
}) {
  return useReadData<AccountResponse>({
    queryKey: ["accounts-summary", JSON.stringify(params)],
    endpoint: API.getAccountSummary,
    params,
  });
}
