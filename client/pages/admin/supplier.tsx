import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import TableWrapper from "@/shared/Table/TableWrapper";
import React, { useState } from "react";
import { ReactTabulator } from "react-tabulator";
import { FaRegEdit } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import { FaRegTrashCan } from "react-icons/fa6";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useRouter } from "next/router";
import AddEditSupplierModal from "../components/pages/admin/supplier/AddEditSupplierModal";
import { Supplier } from "@/api-hooks/supplier/use-list-supplier";

const SupplierPage = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<
    Supplier | undefined
  >();

  const columns = [
    {
      title: "Name",
      field: "name",
      headerSort: false,
    },
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
              data-hs-overlay="#edit-category-modal"
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
        const rowData = cell.getRow().getData() as Supplier;
        const clickedButton = e.target.closest("button");

        if (clickedButton) {
          const buttonId = clickedButton.id;
          if (buttonId === "edit-btn") setSelectedSupplier(rowData);
          else if (buttonId === "delete-btn") setSelectedSupplier(rowData);
        }
      },
    },
  ];

  const [searchValue, setSearchValue] = useState("");
  const onSearchValueChange = (value: string) => {
    setSearchValue(value);
  };

  const router = useRouter();

  return (
    <div>
      <Seo title={"Suppliers List"} />
      {/* back btn to the products list */}

      <Pageheader
        buttonTitle="Add supplier"
        currentpage="Suppliers List"
        withBreadCrumbs={false}
        triggerModalId="add-supplier-modal"
      />

      <TableWrapper
        id="supplier-table"
        searchValue={searchValue}
        onSearchValueChange={onSearchValueChange}
      >
        <ReactTabulator
          className="table-hover table-bordered"
          data={[]}
          columns={columns}
        />
      </TableWrapper>

      <AddEditSupplierModal triggerModalId="add-category-modal" />
      <AddEditSupplierModal
        triggerModalId="edit-category-modal"
        supplier={selectedSupplier}
      />

    </div>
  );
};

SupplierPage.layout = "Contentlayout";
export default SupplierPage;
