import { useListInvoices } from "@/api-hooks/invoices/useListInvoices";
import Modal from "@/shared/Modal";
import { ReactTablePaginated } from "@/shared/ReactTablePaginated";
import React from "react";
import * as XLSX from "xlsx"; // Import XLSX for Excel export

function ExportInvoicesModal({
  totalCount,
  startDate,
  endDate,
  columns,
}: {
  totalCount: number;
  startDate: string | null;
  endDate: string | null;
  columns: any[];
}) {
  const {
    data: invoicesData,
    isLoading,
    isFetching,
  } = useListInvoices({
    startDateState: startDate ?? undefined,
    endDateState: endDate ?? undefined,
    localPageSize: totalCount,
  });

  const exportToExcel = () => {
    const invoices = invoicesData?.invoices || [];
    if (invoices.length === 0) return;

    // Map the data to a format suitable for Excel
    const sheetData = invoices.map((invoice: any) => ({
      "Invoice No.": invoice.number,
      Customer: invoice.customer?.name || "N/A",
      Amount: invoice.accounting.totalUsd,
      "Received Amount": invoice.accounting.paidAmountUsd,
      Status: invoice.accounting.isPaid ? "Paid" : "Unpaid",
      "Issued Date": new Intl.DateTimeFormat("en-US", {
        year: "2-digit",
        month: "short",
        day: "2-digit",
      }).format(new Date(invoice.createdAt)),
      Outstanding:
        invoice.accounting.totalUsd - invoice.accounting.paidAmountUsd,
    }));

    // Create a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(sheetData);

    // Create a workbook with the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");

    // Write the workbook to a file
    XLSX.writeFile(wb, "invoices_summary.xlsx");
  };

  return (
    <Modal size="xl" id="export-invoicesModal">
      <Modal.Header id="export-invoicesModal" title="Invoice Details" />
      <Modal.Body>
        <div>
          <ReactTablePaginated
            pagination={{
              pageIndex: 1,
              pageSize: totalCount,
            }}
            data={invoicesData?.invoices || []}
            hidePagination
            columns={columns}
            loading={isLoading}
            paginating={isFetching}
            totalRows={invoicesData?.pagination.totalCount || 0}
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

export default ExportInvoicesModal;
