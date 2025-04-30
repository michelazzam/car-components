// GET /v1/reports/accounts-receivable-summary

import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export interface CustomerAccount{
customerName:string;
invoiceAmount:number;
amountPaid:number;
outstandingAmount:number;
}

export interface Totals{
    totalInvoiceAmount:number;
    totalAmountPaid:number;
    totalOutstandingAmount:number;
}

interface AccountResponse{
rows:CustomerAccount[];
totals:Totals
}

export function useGetAccountReports() {
  return useReadData<AccountResponse>({
    queryKey: ["accounts-summary"],
    endpoint: API.getAccountSummary,
  });
}
