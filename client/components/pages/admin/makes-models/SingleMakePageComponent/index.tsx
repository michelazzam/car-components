import { useListMakes } from "@/api-hooks/vehicles/makes/use-list-makes";
import Search from "@/components/admin/Search";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { ReactTablePaginated } from "@/shared/ReactTablePaginated";
import { VehicleMakeType } from "@/types/vehicle";
import { createColumnHelper } from "@tanstack/react-table";
import { FaEye, FaPlus, FaRegTrashCan } from "react-icons/fa6";
import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import AddEditMakeModal from "./AddEditMakeModal";
import DeleteRecord from "@/components/admin/DeleteRecord";
import { API } from "@/constants/apiEndpoints";
import AddEditModelModal from "../SingleModelPageComponent/AddEditModelModal";
import Link from "next/link";

function SingleMakePageComponent() {
  const { data: makes, error, isPending, isFetching } = useListMakes();
  const [searchValue, setSearchValue] = useState("");
  const [selectedMake, setSelectedMake] = useState<
    VehicleMakeType | undefined
  >();
  const filteredMakes = makes?.filter((make) => {
    // handle search by make and models
    return (
      make.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      make.models?.some((model) =>
        model.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  });
  const columnHelper = createColumnHelper<VehicleMakeType>();

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),
    columnHelper.accessor("models", {
      header: "Models Amount",

      cell: ({ getValue }) => {
        const models = getValue();

        return (
          <div className="flex gap-x-2">
            <p className="max-w-[100px] md:max-w-[300px] lg:max-w-[400px] xl:max-w-[500px] 2xl:max-w-[600px] truncate">
              {models?.map((model) => model.name).join(", ") || ""}
            </p>
            <div className="px-5 py-0.5 rounded-full bg-primary text-white max-w-fit">
              {" "}
              {models?.length || 0}
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("_id", {
      header: "",
      cell: ({ row }) => (
        <div
          className="flex align-middle gap-2"
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <Link
            href={`/admin/makes/${row.original._id}`}
            id="edit-btn"
            className="btn btn-sm btn-primary edit-btn text-primary border border-primary rounded-md p-1 hover:bg-primary hover:text-white"
            onClick={() => {
              setSelectedMake(row.original);
            }}
          >
            <FaEye />
          </Link>
          <button
            id="edit-btn"
            data-hs-overlay="#add-edit-model-modal"
            className="btn btn-sm btn-primary edit-btn text-primary border border-primary rounded-md p-1 hover:bg-primary hover:text-white"
            onClick={() => {
              setSelectedMake(row.original);
            }}
          >
            <FaPlus />
          </button>
          <button
            id="edit-btn"
            data-hs-overlay="#add-edit-make-modal"
            className="btn btn-sm btn-primary edit-btn text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white"
            onClick={() => {
              setSelectedMake(row.original);
            }}
          >
            <FaRegEdit />
          </button>

          <button
            id="delete-btn"
            data-hs-overlay="#delete-record-modal"
            className="btn btn-sm btn-danger delete-btn text-danger border border-danger rounded-md p-1 hover:bg-danger hover:text-white"
            onClick={() => {
              setSelectedMake(row.original);
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
      <Seo title={"Makes"} />
      <Pageheader
        buttonTitle="Add Make"
        currentpage="Make List"
        withBreadCrumbs={false}
        triggerModalId="add-edit-make-modal"
      />
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
            data={filteredMakes || []}
            columns={columns}
            hidePagination
            loading={isPending}
            paginating={isFetching}
            totalRows={makes?.length || 0}
          />
        </div>
      </div>
      <DeleteRecord
        endpoint={API.deleteMake(selectedMake?._id || "")}
        queryKeysToInvalidate={[["makes"]]}
      />
      <AddEditMakeModal
        triggerModalId="add-edit-make-modal"
        modalTitle={selectedMake ? "Edit Make" : "Add Make"}
        make={selectedMake}
        setMake={setSelectedMake}
      />
      <AddEditModelModal
        triggerModalId="add-edit-model-modal"
        modalTitle={"Add Model to " + selectedMake?.name}
        make={selectedMake as VehicleMakeType}
        setMake={setSelectedMake}
      />
    </div>
  );
}

export default SingleMakePageComponent;
