import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import TableWrapper from "@/shared/Table/TableWrapper";
import React, { useState } from "react";
import { ReactTabulator } from "react-tabulator";
import { FaRegEdit } from "react-icons/fa";
import {
  Printer,
  useListPrinters,
} from "@/api-hooks/printers/use-list-printers";
import AddEditPrinterModal from "../components/pages/admin/printers/AddEditPrinterModal";
import ReactDOMServer from "react-dom/server";
import DeleteRecord from "../components/admin/DeleteRecord";
import { FaRegTrashCan } from "react-icons/fa6";
import { API } from "@/constants/apiEndpoints";

const Printers = () => {
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | undefined>();

  const { data: printers } = useListPrinters();
  const columns = [
    {
      title: "Name",
      field: "name",
      headerSort: false,
    },
    { title: "IP Address", field: "ipAddress", headerSort: false },
    {
      title: "Actions",
      field: "actions",
      width: 150,
      formatter: () =>
        ReactDOMServer.renderToString(
          <div
            className="flex align-middle gap-2"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <button
              id="edit-btn"
              className="btn btn-sm btn-primary edit-btn text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white"
              data-hs-overlay="#edit-printer-modal"
            >
              <FaRegEdit />
            </button>
            <button
              id="delete-btn"
              className="btn btn-sm btn-danger delete-btn text-danger border border-danger rounded-md p-1 hover:bg-danger hover:text-white"
              data-hs-overlay="#delete-record-modal"
            >
              <FaRegTrashCan />
            </button>
          </div>
        ),

      cellClick: (e: any, cell: any) => {
        const rowData = cell.getRow().getData() as Printer;
        const clickedButton = e.target.closest("button");

        if (clickedButton) {
          const buttonId = clickedButton.id;
          if (buttonId === "edit-btn" || buttonId === "delete-btn")
            setSelectedPrinter(rowData);
        }
      },
    },
  ];

  const [searchValue, setSearchValue] = useState("");
  const onSearchValueChange = (value: string) => {
    setSearchValue(value);
  };

  const filteredPrinters = printers?.filter((printer) => {
    return searchValue === ""
      ? true
      : printer.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          printer.ipAddress.toLowerCase().includes(searchValue.toLowerCase());
  });

  return (
    <div>
      <Seo title={"Printers List"} />
      <Pageheader
        buttonTitle="Add Printer"
        currentpage="Printers List"
        withBreadCrumbs={false}
        triggerModalId="add-printer-modal"
      />

      <TableWrapper
        id="printers-table"
        searchValue={searchValue}
        onSearchValueChange={onSearchValueChange}
      >
        <ReactTabulator
          className="table-hover table-bordered"
          data={filteredPrinters}
          columns={columns}
        />
      </TableWrapper>

      <AddEditPrinterModal triggerModalId="add-printer-modal" />
      <AddEditPrinterModal
        triggerModalId="edit-printer-modal"
        printer={selectedPrinter}
      />

      {selectedPrinter && (
        <DeleteRecord
          endpoint={API.deletePrinter(selectedPrinter._id)}
          queryKeysToInvalidate={[["printers"]]}
        />
      )}
    </div>
  );
};

Printers.layout = "Contentlayout";
export default Printers;
