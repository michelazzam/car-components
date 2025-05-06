import { useListInvoices } from "@/api-hooks/invoices/useListInvoices";
import Modal from "@/shared/Modal";
import { ReactTablePaginated } from "@/shared/ReactTablePaginated";
import React from "react";
import * as XLSX from "xlsx"; // Import XLSX for Excel export

function ExportSalesProductsModal({
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
    const flattenedInvoices = invoicesData?.flattenedInvoices || [];
    if (invoices.length === 0) return;

    //product
    //invoice no
    //stock quantity
    //unit cost
    //total value
    //sales price
    //total sales value
    //profit/loss

    // Map the data to a format suitable for Excel
    const sheetData = flattenedInvoices.map((invoice: any) => ({
      Product: invoice.item.name,
      "Invoice No.": invoice.number,
      "Stock Quantity": invoice.item.quantity,
      "Unit Cost": invoice.item.cost?.toLocaleString("en-US"),
      "Total Value": (
        invoice.item.cost * invoice.item.quantity
      )?.toLocaleString("en-US"),
      "Sales Price": invoice.item.price,
      "Total Sales Value": (
        invoice.item.price * invoice.item.quantity
      )?.toLocaleString("en-US"),
      "Profit/Loss": (
        (invoice.item.price - invoice.item.cost) *
        invoice.item.quantity
      )?.toLocaleString("en-US"),
    }));

    // Create a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(sheetData);

    // Create a workbook with the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Products Summary");

    // Write the workbook to a file
    XLSX.writeFile(wb, "sales-products-summary.xlsx");
  };

  return (
    <Modal size="xl" id="export-salesProductsModal">
      <Modal.Header id="export-salesProductsModal" title="Invoice Details" />
      <Modal.Body>
        <div>
          <ReactTablePaginated
            pagination={{
              pageIndex: 1,
              pageSize: totalCount,
            }}
            data={invoicesData?.flattenedInvoices || []}
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

export default ExportSalesProductsModal;
