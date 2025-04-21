import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { useState } from "react";
import { ReactTabulator } from "react-tabulator";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import DeleteRecord from "../components/admin/DeleteRecord";
import { API } from "@/constants/apiEndpoints";
import { Service, useListServices } from "@/api-hooks/services/use-list-services";
import AddEditServiceModal from "../components/pages/admin/service/AddEditServiceModal";

const Services = () => {
  const { data } = useListServices();

  const [selectedService, setSelectedService] = useState<Service | undefined>();

  const columns: any = [
    {
      title: "Name",
      field: "name",
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
              data-hs-overlay="#edit-service-modal"
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
        const rowData = cell.getRow().getData() as Service;
        const clickedButton = e.target.closest("button");

        if (clickedButton) {
          const buttonId = clickedButton.id;
          if (buttonId === "edit-btn" || buttonId === "delete-btn")
            setSelectedService(rowData);
        }
      },
    },
  ];

  return (
    <div>
      <Seo title={"Inventory List"} />
      <Pageheader
        buttonTitle="Add Service"
        currentpage="Service List"
        withBreadCrumbs={false}
        triggerModalId="add-service-modal"
      />

      {/* Temp using it directly instead of the reusable component since i need to add link to the categories page */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            {/* <div className="box-header flex justify-between items-center">
              <div className="flex space-x-2 items-center">
                <div className="w-[20rem]">
                  <Search onChangeSearch={(v) => setSearch(v)} value={search} />
                </div>
              </div>
            </div> */}
            <div className="box-body space-y-3">
              <div className="overflow-hidden table-bordered">
                <div className="ti-custom-table ti-striped-table ti-custom-table-hover">
                  <ReactTabulator
                    className="table-hover table-bordered"
                    data={data}
                    columns={columns}
                  />
                </div>
              </div>
              {/* <Pagination
                pageSize={pageSize}
                setPageSize={setPageSize}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={data?.totalPages || 0}
              /> */}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AddEditServiceModal
        triggerModalId="edit-service-modal"
        service={selectedService}
        modalTitle="Edit Service"
        setService={setSelectedService}
      />
      {/* Add Modal */}
      <AddEditServiceModal
        triggerModalId="add-service-modal"
        service={undefined}
        modalTitle="Add Service"
        setService={setSelectedService}
      />


      {selectedService && (
        <DeleteRecord
          endpoint={API.deleteService(selectedService._id)}
          queryKeysToInvalidate={[["services"]]}
        />
      )}
    </div>
  );
};
Services.layout = "Contentlayout";

export default Services;
