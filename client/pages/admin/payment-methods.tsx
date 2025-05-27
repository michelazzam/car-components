import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";

import { API } from "@/constants/apiEndpoints";

import { createColumnHelper } from "@tanstack/react-table";
import { ReactTablePaginated } from "@/shared/ReactTablePaginated";
import TableWrapper from "@/shared/Table/TableWrapper";
import DeleteRecord from "@/components/admin/DeleteRecord";
import AddEditPaymentMethodModal from "@/components/pages/admin/payment-methods/AddEditPaymentMethodModal";
import {
  PaymentMethod,
  useListPaymentMethods,
} from "@/api-hooks/payment-methods/use-list-payment-method";

const PaymentMethods = () => {
  const { data, error, isLoading, isFetching } = useListPaymentMethods({});

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PaymentMethod | undefined
  >();

  const columnHelper = createColumnHelper<PaymentMethod>();
  const tanstackColumns = [
    columnHelper.accessor("method", {
      header: "Method Name",
    }),

    columnHelper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex align-middle gap-2 justify-end">
          <button
            id="edit-btn"
            onClick={() => setSelectedPaymentMethod(row.original)}
            className="btn btn-sm btn-primary edit-btn text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white"
            data-hs-overlay="#edit-payment-method-modal"
          >
            <FaRegEdit />
          </button>
          <button
            id="delete-btn"
            onClick={() => setSelectedPaymentMethod(row.original)}
            className="btn btn-sm btn-danger delete-btn text-danger border border-danger rounded-md p-1 hover:bg-danger hover:text-white"
            data-hs-overlay="#delete-record-modal"
          >
            <FaRegTrashCan />
          </button>
        </div>
      ),
    }),
  ];

  return (
    <div>
      <Seo title={"Inventory List"} />
      <Pageheader
        buttonTitle="Add Payment Method"
        currentpage="Payment Methods List"
        withBreadCrumbs={false}
        triggerModalId="add-payment-method-modal"
      />

      <TableWrapper id="inventory-table" withSearch={false}>
        <ReactTablePaginated
          errorMessage={error?.message}
          data={data || []}
          columns={tanstackColumns}
          loading={isLoading}
          paginating={isFetching}
          totalRows={data?.length || 0}
          hidePagination
        />
      </TableWrapper>

      {/* Edit Modal */}
      <AddEditPaymentMethodModal
        triggerModalId="edit-payment-method-modal"
        paymentMethod={selectedPaymentMethod}
        modalTitle="Edit Product"
        setpaymentMethod={setSelectedPaymentMethod}
      />
      {/* Add Modal */}
      <AddEditPaymentMethodModal
        triggerModalId="add-payment-method-modal"
        paymentMethod={undefined}
        modalTitle="Add Product"
        setpaymentMethod={setSelectedPaymentMethod}
      />

      {selectedPaymentMethod && (
        <DeleteRecord
          endpoint={API.deletePaymentMethod(selectedPaymentMethod._id)}
          queryKeysToInvalidate={[["payment-methods"]]}
        />
      )}
    </div>
  );
};
PaymentMethods.layout = "Contentlayout";

export default PaymentMethods;
