import {
  CustomerAccount,
  useGetAccountReports,
} from "@/api-hooks/report/get-account-summary";
import Modal from "@/shared/Modal";
import { ReactTablePaginated } from "@/shared/ReactTablePaginated";
import React from "react";
import * as XLSX from "xlsx"; // Import XLSX for Excel export

function AccountsReceivableSummaryModal({
  totalCount,
  columns,
  startDate,
  endDate,
}: {
  totalCount: number;
  columns: any[];
  startDate: string | null;
  endDate: string | null;
}) {
  const { data: summaryData, isLoading } = useGetAccountReports({
    pageSize: totalCount,
    pageIndex: 0,
    startDate: startDate ?? undefined,
    endDate: endDate ?? undefined,
  });

  const exportToExcel = () => {
    const summaryRows = summaryData?.rows || [];
    if (summaryRows.length === 0) return;

    // Map the data to a format suitable for Excel
    let sheetData = summaryRows.map((item: CustomerAccount) => ({
      "Customer Name": item.customerName,
      "Invoice Amount": item.invoiceAmount,
      "Amount Paid": item.amountPaid,
      "Outstanding Amount": item.outstandingAmount,
    }));
    //add totals to the sheet
    sheetData.push({
      "Customer Name": "Total", // Indicating that this is a total row
      "Invoice Amount": summaryData?.totals?.totalInvoiceAmount || 0,
      "Amount Paid": summaryData?.totals?.totalAmountPaid || 0,
      "Outstanding Amount": summaryData?.totals?.totalOutstandingAmount || 0,
    });

    // Create a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(sheetData);

    // Create a workbook with the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Accounts Receivable Summary");

    // Write the workbook to a file
    XLSX.writeFile(wb, "accounts-receivable-summary.xlsx");
  };

  return (
    <Modal size="xl" id="export-accountsSummaryModal">
      <Modal.Header
        id="export-accountsSummaryModal"
        title="Accounts Receivable Summary"
      />
      <Modal.Body>
        <div>
          <ReactTablePaginated
            pagination={{
              pageIndex: 1,
              pageSize: totalCount,
            }}
            data={summaryData?.rows || []}
            hidePagination
            columns={columns}
            loading={isLoading}
            totalRows={summaryData?.pagination?.totalCount || 0}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="ti ti-btn ti-btn-primary"
          onClick={exportToExcel} // Trigger the export
        >
          Download As Excel
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default AccountsReceivableSummaryModal;
