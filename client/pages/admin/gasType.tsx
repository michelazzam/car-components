import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { useEffect, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import DeleteRecord from "../../components/admin/DeleteRecord";
import { API } from "@/constants/apiEndpoints";
import Search from "../../components/admin/Search";
import { GasType, useListGasType } from "@/api-hooks/gasType/use-list-gasTypes";

const GasTypes = () => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<GasType[]>([]);
  const { data: gasTypeData } = useListGasType();
  const [selectedGasType, setSelectedGasType] = useState<GasType | undefined>();

  // Filter the expenses data based on the search term
  useEffect(() => {
    if (gasTypeData) {
      if (search) {
        const filtered = gasTypeData.filter((item: GasType) =>
          item.title.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(gasTypeData);
      }
    }
  }, [search, gasTypeData]);

  const columns: any = [
    {
      title: "Title",
      field: "title",
      sorter: "string",
      headerSort: false,
    },
    {
      title: "Date",
      field: "createdAt",
      headerSort: true,
      formatter: (cell: any) => {
        const dateValue = new Date(cell.getValue()); // Convert string to Date
        return dateValue.toLocaleString("en-US", {
          year: "2-digit",
          month: "short",
          day: "2-digit",
        });
      },
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
              data-hs-overlay="#edit-gas-type-modal"
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
        const rowData = cell.getRow().getData() as GasType;
        const clickedButton = e.target.closest("button");

        if (clickedButton) {
          const buttonId = clickedButton.id;
          if (buttonId === "edit-btn" || buttonId === "delete-btn")
            setSelectedGasType(rowData);
          console.log(rowData);
        }
      },
    },
  ];

  return (
    <div>
      <Seo title={"Gas Type List"} />
      <Pageheader
        currentpage="Gas Type List"
        withBreadCrumbs={false}
        triggerModalId="add-gas-type-modal"
        buttonTitle="Add Gas Type"
      />

      {/* Temp using it directly instead of the reusable component since i need to add link to the categories page */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header flex justify-between items-center">
              <div className="grid grid-cols-12 space-x-2 items-center">
                <div className="col-span-3 mb-4">
                  <Search
                    placeholder="Search By title"
                    onChangeSearch={(v) => setSearch(v)}
                    value={search}
                  />
                </div>
              </div>
            </div>
            <div className="box-body space-y-3">
              <div className="overflow-hidden table-bordered">
                <div className="ti-custom-table ti-striped-table ti-custom-table-hover">
                  <ReactTabulator
                    className="table-hover table-bordered"
                    data={filteredData}
                    columns={columns}
                    options={{
                      maxHeight: 530,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <GasTypeModal
        triggerModalId="edit-gas-type-modal"
        gasType={selectedGasType}
        modalTitle="Edit Gas Type"
        setSelectedGasType={setSelectedGasType}
      />
      <GasTypeModal
        triggerModalId="add-gas-type-modal"
        gasType={selectedGasType}
        modalTitle="Add Gas Type"
        setSelectedGasType={setSelectedGasType}
      /> */}

      <DeleteRecord
        endpoint={API.deleteGasType(selectedGasType?._id || "")}
        queryKeysToInvalidate={[["gas-type"]]}
      />
    </div>
  );
};
GasTypes.layout = "Contentlayout";

export default GasTypes;
