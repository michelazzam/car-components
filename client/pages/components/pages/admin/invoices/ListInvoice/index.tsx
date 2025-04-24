import React, { useEffect, useState } from "react";

import { API } from "@/constants/apiEndpoints";
import Search from "@/pages/components/admin/Search";
import DatePicker from "react-datepicker";
import PrintInvoiceModal from "../PrintInvoiceModal";
import DeleteRecord from "@/pages/components/admin/DeleteRecord";
import { FaRegEdit } from "react-icons/fa";
import { FaPrint, FaRegTrashCan } from "react-icons/fa6";
import { useRouter } from "next/router";
import { Invoice, useListInvoices } from "@/api-hooks/invoices/useListInvoices";
import { cn } from "@/utils/cn";
// import { formatNumber } from "@/lib/helpers/formatNumber";
import SelectField from "@/pages/components/admin/Fields/SlectField";
import { usePosStore } from "@/shared/store/usePosStore";
import AddPaymentModal from "../../customers/AddPaymentModal";
import { useListVehicles } from "@/api-hooks/vehicles/use_list_vehicles";
import { useDebounce } from "@/hooks/useDebounce";
import useListInvoicesQueryStrings from "@/shared/helper-hooks/useListInvoicesQueryStrings";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ReactTablePaginated,
  useReactTablePagination,
} from "@/shared/ReactTablePaginated";
import Checkbox from "@/pages/components/admin/Fields/Checkbox";

const paidStatuses = [
  {
    label: "Paid",
    value: "paid",
  },
  {
    label: "Unpaid",
    value: "unpaid",
  },
];

function ListInvoice({ customerId }: { customerId?: string }) {
  const {
    paymentStatus,
    setPaymentStatus,
    search,
    setSearch,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearDates,
    selectedVehicleId,
    setSelectedVehicleId,
  } = useListInvoicesQueryStrings();

  //----TABLE STATES------
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>();
  const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  //------Storage---------\
  const { setEditingInvoice } = usePosStore();

  const columnHelper = createColumnHelper<Invoice>();
  const tanstackColumns = [
    columnHelper.display({
      id: "select",
      header: () => (
        <div className="flex items-center justify-center">
          <Checkbox
            isChecked={areAllSelected}
            onValueChange={handleSelectAll}
            label={
              selectedInvoices.length ? `(${selectedInvoices.length})` : ""
            }
          />
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <Checkbox
              isChecked={selectedInvoices.includes(row.original)}
              onValueChange={(value) => {
                if (value) {
                  setSelectedInvoices([...selectedInvoices, row.original]);
                } else {
                  setSelectedInvoices(
                    selectedInvoices.filter(
                      (invoice) => invoice._id !== row.original._id
                    )
                  );
                }
              }}
            />
          </div>
        );
      },
    }),

    // columnHelper.accessor("invoiceNumber", {
    //   header: "Invoice No.",
    //   cell: ({ getValue }) => <div>TB{getValue()}</div>,
    // }),

    ...(!customerId
      ? [
          columnHelper.accessor("customer.name", {
            header: "Customer",
          }),
        ]
      : []),

    // columnHelper.accessor("finalPriceUsd", {
    //   header: "Amount",
    //   cell: ({ getValue }) => <div>{formatNumber(getValue(), 2)}$</div>,
    // }),

    // columnHelper.accessor("paidAmountUsd", {
    //   header: "Received Amount",
    //   cell: ({ getValue, row }) => (
    //     <div>
    //       <div>{formatNumber(getValue(), 2)}$</div>
    //       <div>{formatNumber(row.original.paidAmountUsd, 0)}L.L</div>
    //     </div>
    //   ),
    // }),

    // columnHelper.accessor("isPaid", {
    //   header: "Status",
    //   cell: ({ getValue, row }) => {
    //     return (
    //       <button
    //         data-hs-overlay={!getValue() && "#add-payment-modal"}
    //         className={cn(
    //           "rounded-md px-3 py-1 text-center",
    //           getValue() ? "text-success" : "border border-danger text-danger"
    //         )}
    //         onClick={() => setSelectedInvoice(row.original)}
    //       >
    //         {getValue() ? "Paid" : "Unpaid"}
    //       </button>
    //     );
    //   },
    // }),

    columnHelper.accessor("createdAt", {
      header: "Issued Date",
      cell: ({ getValue }) => (
        <div className="w-fit">
          {new Intl.DateTimeFormat("en-US", {
            year: "2-digit", // Use "2-digit" for two-digit year
            month: "short", // Use "short" for abbreviated month name
            day: "2-digit", // Use "2-digit" for two-digit day
          }).format(new Date(getValue()))}
        </div>
      ),
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
            data-hs-overlay="#edit-invoice-modal"
            className="btn btn-sm btn-primary edit-btn text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white"
            onClick={() => {
              setSelectedInvoice(row.original);
              setEditingInvoice(row.original);
              router.push("/add-invoice");
            }}
          >
            <FaRegEdit />
          </button>

          <button
            id="print-btn"
            data-hs-overlay="#print-invoice-modal"
            className="btn btn-sm btn-primary edit-btn text-orange border border-orange rounded-md p-1 hover:bg-secondary hover:text-white"
            onClick={() => {
              setSelectedInvoice(row.original);
            }}
          >
            <FaPrint />
          </button>
          <button
            id="delete-btn"
            data-hs-overlay="#delete-record-modal"
            className="btn btn-sm btn-danger delete-btn text-danger border border-danger rounded-md p-1 hover:bg-danger hover:text-white"
            onClick={() => {
              setSelectedInvoice(row.original);
            }}
          >
            <FaRegTrashCan />
          </button>
        </div>
      ),
    }),
  ];
  const { pagination, setPagination } = useReactTablePagination();

  const {
    data: invoicesData,
    isLoading,
    isFetching,
    error,
  } = useListInvoices({ customerId });
  const router = useRouter();

  // Calculate the total amount for all invoices
  useEffect(() => {
    const calculateTotalAmount = () => {
      const total = invoicesData?.invoices?.reduce(
        (acc, invoice) => acc + (invoice.accounting.totalUsd || 0),
        0
      );
      setTotalAmount(total || 0);
    };

    calculateTotalAmount();
  }, [invoicesData]);

  const areAllSelected =
    selectedInvoices.length === invoicesData?.invoices?.length;

  const handleSelectAll = () => {
    if (areAllSelected) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(invoicesData?.invoices || []);

      // fetch all invoices from db and set them
    }
  };

  // for vehicle filter
  const [vehicleSearch, setVehicleSearch] = useState("");
  const debouncedVehicleSearch = useDebounce(vehicleSearch);
  const { data } = useListVehicles({
    pageIndex: 0,
    search: debouncedVehicleSearch?.toString(),
    customerId,
  });
  const vehiclesOptions = data?.vehicles.map((vehicle) => {
    return {
      label: `${vehicle.model} - ${vehicle.number}`,
      value: vehicle._id,
    };
  });

  return (
    <div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header flex justify-between items-start">
              {/* Filters */}
              <div className="grid gap-x-2 grid-cols-12 items-center">
                <div className="col-span-3">
                  <Search
                    onChangeSearch={(v) => setSearch(v.trim())}
                    value={String(search)}
                    placeholder="Search by notes, vehicle nb, etc"
                  />
                </div>
                <SelectField
                  marginBottom="mb-1"
                  placeholder="payment status"
                  isClearable={true}
                  options={paidStatuses}
                  onChangeValue={(v) => {
                    if (v) setPaymentStatus(v.value?.toString());
                    else setPaymentStatus("");
                  }}
                  value={paidStatuses.find(
                    (status) => status.value === paymentStatus
                  )}
                  colSpan={2}
                />

                <div className="col-span-4 mt-3.5">
                  <SelectField
                    options={vehiclesOptions || []}
                    placeholder={"Filter by vehicle"}
                    creatable={false}
                    onInputChange={(value) => {
                      setVehicleSearch(value);
                    }}
                    onChangeValue={(opt) => {
                      setSelectedVehicleId(opt?.value?.toString() || "");
                    }}
                    value={vehiclesOptions?.find(
                      (vehicle) => vehicle.value === selectedVehicleId
                    )}
                    isClearable
                  />
                </div>

                <div className="col-span-3 input-group">
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-text text-[#8c9097] dark:text-white/50">
                        {" "}
                        <i className="ri-calendar-line"></i>{" "}
                      </div>

                      <DatePicker
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                        placeholderText="Filter by Date"
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update: [Date, Date]) => {
                          // on clearing
                          if (!update[0] && !update[1]) clearDates();

                          if (update[0]) setStartDate(update[0]);
                          if (update[1]) setEndDate(update[1]);
                        }}
                        isClearable={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button
                data-hs-overlay="#print-invoices-modal"
                disabled={selectedInvoices?.length === 0}
                className={cn(
                  "ti-btn ti-btn-primary-full ti-btn-wave col-span-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                Print Invoices
              </button>
            </div>

            <div className="py-2 px-4">
              <ReactTablePaginated
                errorMessage={error?.message}
                data={invoicesData?.invoices || []}
                columns={tanstackColumns}
                loading={isLoading}
                paginating={isFetching}
                pagination={pagination}
                setPagination={setPagination}
                totalRows={invoicesData?.totalCount || 0}
                totalAmount={totalAmount.toFixed(2) + "$"}
              />
            </div>
          </div>
        </div>
      </div>

      <DeleteRecord
        endpoint={API.deleteInvoice(selectedInvoice?._id || "")}
        queryKeysToInvalidate={[["invoices"]]}
      />

      {/* for single invoice (the icon in the table) */}
      <PrintInvoiceModal
        triggerModalId="print-invoice-modal"
        title="Print Invoice"
        printingInvoices={selectedInvoice ? [selectedInvoice] : undefined}
      />

      <AddPaymentModal
        triggerModalId="add-payment-modal"
        selectedInvoice={selectedInvoice}
        modalTitle="Pay in USD / LBP"
      />

      {/* for multiple invoices (the btn above the table) */}
      <PrintInvoiceModal
        triggerModalId="print-invoices-modal"
        title="Print Invoice"
        printingInvoices={selectedInvoices}
      />
    </div>
  );
}

export default ListInvoice;
