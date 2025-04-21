import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { useState } from "react";
import { ReactTabulator } from "react-tabulator";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import {
  Product,
  useListProducts,
} from "@/api-hooks/products/use-list-products";
import AddEditProductModal from "../components/pages/admin/menu/AddEditProductModal";
import DeleteRecord from "../components/admin/DeleteRecord";
import { API } from "@/constants/apiEndpoints";
import { useDebounce } from "@/hooks/useDebounce";
import Search from "../components/admin/Search";
import IncreaseStockModal from "../components/pages/admin/inventory/IncreaseStock";
import Pagination from "../components/admin/Pagination";
import DecreaseStockModal from "../components/pages/admin/inventory/DecreaseStock";

const Inventory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { data } = useListProducts({
    pageIndex: currentPage-1,
    search: debouncedSearch,
    pageSize: pageSize,
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const columns: any = [
    {
      title: "Name",
      field: "name",
      sorter: "string",
      headerSort: false,
    },
    {
      title: "Supplier",
      field: "supplier.name",
      sorter: "string",
      headerSort: false,
    },
    {
      title: "Price",
      field: "price",
      headerSort: false,
      formatter: (cell: any) => {
        return cell.getValue().toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      },
    },
    {
      title: "Quantity",
      field: "quantity",
      headerSort: false,
      // formatter: (cell: any) => {
      //   return ReactDOMServer.renderToString(
      //     <div className="flex justify-between">
      //       <span> {cell.getValue()}</span>
      //       <div className="flex space-x-2">
      //         <button
      //           className="btn btn-sm btn-primary edit-btn text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white"
      //           id="add-stock"
      //           data-hs-overlay="#increase-stock-modal"
      //         >
      //           Add
      //         </button>
      //         <button
      //           className="btn btn-sm btn-primary edit-btn text-red border border-red rounded-md p-1 hover:bg-red hover:text-white"
      //           id="add-stock"
      //           data-hs-overlay="#decrease-stock-modal"
      //         >
      //           Used
      //         </button>
      //       </div>
      //     </div>
      //   );
      // },

      // cellClick: (e: any, cell: any) => {
      //   const rowData = cell.getRow().getData() as Product;
      //   const clickedButton = e.target.closest("button");

      //   if (clickedButton) {
      //     const buttonId = clickedButton.id;
      //     if (buttonId === "add-stock") setSelectedProduct(rowData);
      //   }
      // },
    },
    {
      title: "Actions",
      field: "actions",
      width: 150,
      headerSort: false,
      formatter: () => {
        return ReactDOMServer.renderToString(
          <div
            className="flex align-middle gap-2"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <button
              id="edit-btn"
              className="btn btn-sm btn-primary edit-btn text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white"
              data-hs-overlay="#edit-product-modal"
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
        );
      },

      cellClick: (e: any, cell: any) => {
        const rowData = cell.getRow().getData() as Product;
        const clickedButton = e.target.closest("button");

        if (clickedButton) {
          const buttonId = clickedButton.id;
          if (buttonId === "edit-btn" || buttonId === "delete-btn")
            setSelectedProduct(rowData);
        }
      },
    },
  ];

  return (
    <div>
      <Seo title={"Inventory List"} />
      <Pageheader
        buttonTitle="Add Product"
        currentpage="Inventory List"
        withBreadCrumbs={false}
        triggerModalId="add-product-modal"
      />

      {/* Temp using it directly instead of the reusable component since i need to add link to the categories page */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header flex justify-between items-center">
              <div className="flex space-x-2 items-center">
                <div className="w-[20rem]">
                  <Search onChangeSearch={(v) => setSearch(v)} value={search} />
                </div>
              </div>
            </div>
            <div className="box-body space-y-3">
              <div className="overflow-hidden table-bordered">
                <div className="ti-custom-table ti-striped-table ti-custom-table-hover">
                  <ReactTabulator
                    className="table-hover table-bordered"
                    data={data?.items}
                    columns={columns}
                  />
                </div>
              </div>
              <Pagination
                pageSize={pageSize}
                setPageSize={setPageSize}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={data?.totalPages || 0}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AddEditProductModal
        triggerModalId="edit-product-modal"
        product={selectedProduct}
        modalTitle="Edit Product"
        setProduct={setSelectedProduct}
      />
      {/* Add Modal */}
      <AddEditProductModal
        triggerModalId="add-product-modal"
        product={undefined}
        modalTitle="Add Product"
        setProduct={setSelectedProduct}
      />

      <IncreaseStockModal productId={selectedProduct?._id || ""} />
      <DecreaseStockModal product={selectedProduct} />

      {selectedProduct && (
        <DeleteRecord
          endpoint={API.deleteProduct(selectedProduct._id)}
          queryKeysToInvalidate={[["products"]]}
        />
      )}
    </div>
  );
};
Inventory.layout = "Contentlayout";

export default Inventory;
