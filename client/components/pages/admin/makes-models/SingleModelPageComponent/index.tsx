import Search from "@/components/admin/Search";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { ReactTablePaginated } from "@/shared/ReactTablePaginated";
import { createColumnHelper } from "@tanstack/react-table";
import { FaRegTrashCan } from "react-icons/fa6";
import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import DeleteRecord from "@/components/admin/DeleteRecord";
import { API } from "@/constants/apiEndpoints";
import AddEditModelModal from "../SingleModelPageComponent/AddEditModelModal";
import { useListMakeModels } from "@/api-hooks/vehicles/makes/model/use-list-make-models";
import { VehicleModelType } from "@/types/vehicle";
import BackBtn from "@/components/common/BackBtn";

function SingleModelPageComponent({ makeId }: { makeId: string }) {
  const {
    data: make,
    error,
    isPending,
    isFetching,
  } = useListMakeModels({
    makeId,
  });
  const models = make?.models;

  const [searchValue, setSearchValue] = useState("");
  const [selectedModel, setselectedModel] = useState<
    VehicleModelType | undefined
  >();
  const filteredModels = models?.filter((model) => {
    // handle search by make and models
    return model.name.toLowerCase().includes(searchValue.toLowerCase());
  });

  const columnHelper = createColumnHelper<VehicleModelType>();

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),

    columnHelper.accessor("_id", {
      header: "",
      cell: ({ row }) => (
        <div
          className="flex align-middle gap-2"
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <button
            id="edit-btn"
            data-hs-overlay="#add-edit-model-modal"
            className="btn btn-sm btn-primary edit-btn text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white"
            onClick={() => {
              setselectedModel(row.original);
            }}
          >
            <FaRegEdit />
          </button>

          <button
            id="delete-btn"
            data-hs-overlay="#delete-record-modal"
            className="btn btn-sm btn-danger delete-btn text-danger border border-danger rounded-md p-1 hover:bg-danger hover:text-white"
            onClick={() => {
              setselectedModel(row.original);
            }}
          >
            <FaRegTrashCan />
          </button>
        </div>
      ),
    }),
  ];

  return (
    <div>
      <Seo title={"Models"} />
      <div className="flex items-center gap-x-4">
        <div className="">
          <BackBtn href="/admin/makes" />
        </div>
        <div className="flex-grow">
          <Pageheader
            buttonTitle="Add Model"
            currentpage={"Model List of " + make?.name}
            withBreadCrumbs={false}
            triggerModalId="add-edit-model-modal"
          />
        </div>
      </div>
      <div className="box ">
        <div className="box-header">
          <Search
            onChangeSearch={(value) => {
              setSearchValue(value);
            }}
            value={searchValue}
          />
        </div>

        <div className="box-body">
          <ReactTablePaginated
            overflowX="overflow-x-hidden"
            errorMessage={error?.message}
            data={filteredModels || []}
            columns={columns}
            hidePagination
            loading={isPending}
            paginating={isFetching}
            totalRows={models?.length || 0}
          />
        </div>
      </div>
      <DeleteRecord
        endpoint={API.deleteModel(makeId, selectedModel?._id || "")}
        queryKeysToInvalidate={[[makeId]]}
      />

      {make && (
        <AddEditModelModal
          triggerModalId="add-edit-model-modal"
          modalTitle={"Add Model to " + make?.name}
          make={make}
          setModel={setselectedModel}
          model={selectedModel}
        />
      )}
    </div>
  );
}

export default SingleModelPageComponent;
