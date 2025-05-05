import { useListProducts } from "@/api-hooks/products/use-list-products";
import Modal from "@/shared/Modal";
import { ReactTablePaginated } from "@/shared/ReactTablePaginated";
import React from "react";
import * as XLSX from "xlsx"; // Import XLSX for Excel export

function ExportInventoryModal({
  totalCount,
  columns,
}: {
  totalCount: number;
  columns: any[];
}) {
  const {
    data: inventoryData,
    isLoading,
    isFetching,
  } = useListProducts({
    pageSize: totalCount,
    pageIndex: 0,
  });

  const exportToExcel = () => {
    const inventory = inventoryData?.items || [];
    if (inventory.length === 0) return;

    // Map the data to a format suitable for Excel
    const sheetData = inventory.map((item: any) => ({
      "Product Name": item.name,
      Quantity: item.quantity,
      Price: item.price,
      Cost: item.cost,
      Total: item.totalPrice,
      Profit: item.profitOrLoss,
      "Issued Date": new Intl.DateTimeFormat("en-US", {
        year: "2-digit", // Use "2-digit" for two-digit year
        month: "short", // Use "short" for abbreviated month name
        day: "2-digit", // Use "2-digit" for two-digit day
        hour: "2-digit", // Use "2-digit" for two-digit hour
        minute: "2-digit", // Use "2-digit" for two-digit minute
      }).format(new Date(item.createdAt)),
      Outstanding: item.quantity - item.quantity,
    }));

    // Create a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(sheetData);

    // Create a workbook with the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");

    // Write the workbook to a file
    XLSX.writeFile(wb, "inventory_summary.xlsx");
  };

  return (
    <Modal size="xl" id="export-inventoryModal">
      <Modal.Header id="export-inventoryModal" title="Inventory Summary" />
      <Modal.Body>
        <div>
          <ReactTablePaginated
            pagination={{
              pageIndex: 1,
              pageSize: totalCount,
            }}
            data={inventoryData?.items || []}
            hidePagination
            columns={columns}
            loading={isLoading}
            paginating={isFetching}
            totalRows={inventoryData?.pagination?.totalCount || 0}
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

export default ExportInventoryModal;
