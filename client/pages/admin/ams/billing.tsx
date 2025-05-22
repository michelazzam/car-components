import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { useState } from "react";
import { ReactTabulator } from "react-tabulator";
import ReactDOMServer from "react-dom/server";
import { useGetBilling } from "@/api-service/billing/useFetchData";
import PrintBillingInvoiceModal from "@/components/pages/ams/PrintBillingInvoiceModal";
import { cn } from "@/utils/cn";

//invoice interface
interface BankAccount {
  accountNumber: string;
  iban: string;
  currencyCode: string;
  swiftCode: string;
}

interface InvoiceDetail {
  _id: string;
  description: string;
  price: number;
  quantity: number;
}

interface Client {
  _id: string;
  contactName: string;
  businessName: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Organization {
  _id: string;
  contactName: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
  isActive: boolean;
  tax: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Billing {
  _id: string;
  client: Client;
  status: "draft" | "sent" | "paid" | "cancelled";
  paymentMethod: "cash" | "bank" | "payment-link";
  usdRate: number;
  bankAccount: BankAccount;
  paymentLink: string;
  notes: string;
  discount: number;
  paidAt?: string;
  details: InvoiceDetail[];
  createdAt: string;
  updatedAt: string;
  number: string;
  organization: Organization;
  __v: number;
}

const billing = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<Billing | undefined>();
  const [isReceipt, setIsReceipt] = useState(false);

  const { data, isPending, error } = useGetBilling();

  const columns: any = [
    { title: "Invoice #", field: "number", headerSort: false },
    {
      title: "Amount",
      field: "totalAmount",
      headerSort: false,
      formatter: (cell: any) => {
        const rowData = cell.getRow().getData() as Billing;
        const amount =
          rowData.details.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          ) - rowData.discount || 0;
        return amount.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      },
    },
    {
      title: "Issued At",
      field: "createdAt",
      headerSort: false,
      formatter: (cell: any) => {
        const rowData = cell.getRow().getData() as Billing;
        return ReactDOMServer.renderToString(
          <div className="flex justify-center">
            <span>{rowData.createdAt?.slice(0, 10)}</span>
          </div>
        );
      },
    },
    {
      title: "Paid At",
      field: "paidAt",
      headerSort: false,
      formatter: (cell: any) => {
        const rowData = cell.getRow().getData() as Billing;
        return ReactDOMServer.renderToString(
          <div className="flex justify-center">
            <span>{rowData.paidAt?.slice(0, 10)}</span>
          </div>
        );
      },
    },

    {
      title: "Status",
      field: "status",
      width: 200,
      headerSort: false,
      formatter: (cell: any) => {
        const rowData = cell.getRow().getData() as Billing;
        if (rowData.status !== "paid") {
          return ReactDOMServer.renderToString(
            <div className="flex justify-center">
              <b className="text-yellow">Pending</b>
            </div>
          );
        } else {
          return ReactDOMServer.renderToString(
            <div className="flex justify-between items-center gap-2">
              <b className="text-secondary">Paid</b>
              <button
                id="print-invoice-btn"
                className="btn btn-sm btn-primary text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white"
                data-hs-overlay="#print-invoice-modal"
              >
                Print Receipt
              </button>
            </div>
          );
        }
      },
      cellClick: (e: any, cell: any) => {
        const rowData = cell.getRow().getData() as Billing;
        const clickedButton = e.target.closest("button");

        if (clickedButton && clickedButton.id === "print-invoice-btn") {
          setSelectedInvoice(rowData);
          setIsReceipt(true);
          console.log("Printing invoice:", rowData);
        }
      },
    },
    {
      title: "Actions",
      field: "actions",
      width: 150,
      headerSort: false,
      formatter: () => {
        return ReactDOMServer.renderToString(
          <div className="flex justify-center">
            <button
              id="print-invoice-btn"
              className="btn btn-sm btn-primary text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white"
              data-hs-overlay="#print-invoice-modal"
            >
              Print Invoice
            </button>
          </div>
        );
      },
      cellClick: (e: any, cell: any) => {
        const rowData = cell.getRow().getData() as Billing;
        const clickedButton = e.target.closest("button");

        if (clickedButton && clickedButton.id === "print-invoice-btn") {
          setSelectedInvoice(rowData);
          setIsReceipt(false);
        }
      },
    },
  ];

  const hasPaidAllInvoices =
    data && data?.length > 0
      ? data?.every((invoice) => invoice.status === "paid")
      : false;

  return (
    <div>
      <Seo title={"Billing"} />
      <Pageheader currentpage="Billing(AMS)" withBreadCrumbs={false} />
      {isPending && (
        <div
          className={cn(
            "flex flex-col justify-center items-center py-32 w-full  rounded-md ",
            isPending ? "bg-info/10 animate-pulse" : "bg-success/10"
          )}
        >
          {!isPending && <i className="bx bx-party text-7xl text-success"></i>}
          <p
            className={cn(
              "text-3xl font-semibold",
              isPending ? "text-info" : "text-success"
            )}
          >
            {isPending
              ? "Loading billings..."
              : "  Congratulations! You have no billings yet..."}
          </p>
        </div>
      )}

      {!isPending && data && data.length === 0 && (
        <div
          className={cn(
            "flex flex-col justify-center items-center py-32 w-full  rounded-md ",
            "bg-success/10"
          )}
        >
          <i className="bx bx-party text-7xl text-success"></i>
          <p className={cn("text-3xl font-semibold text-success")}>
            You have no billings yet...
          </p>
        </div>
      )}

      {error && (
        <div className="flex  gap-x-4 justify-center items-center py-4 w-full bg-danger/10 rounded-md mb-4 ">
          <p className=" font-semibold text-lg text-danger">{error.message}</p>
        </div>
      )}

      {hasPaidAllInvoices && (
        <div className="flex  gap-x-4 justify-center items-center py-4 w-full bg-success/10 rounded-md mb-4 ">
          <i className="bx bx-party text-lg text-success"></i>
          <p className=" font-semibold text-lg text-success">
            Congratulations! You have paid all your invoices.
          </p>
        </div>
      )}

      {!error && data && data.length !== 0 && !isPending && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="box">
              <div className="box-header flex justify-between items-center flex-wrap">
                <div className="flex space-x-2 items-center flex-wrap gap-2">
                  <div className="sm:w-[20rem] w-full"></div>
                </div>
              </div>
              <div className="box-body space-y-3">
                <div className="overflow-hidden table-bordered">
                  <div className="ti-custom-table ti-striped-table ti-custom-table-hover">
                    <ReactTabulator
                      key="invoice-table"
                      className="table-hover table-bordered"
                      data={data}
                      columns={columns}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedInvoice && (
        <PrintBillingInvoiceModal
          triggerModalId="print-invoice-modal"
          invoice={selectedInvoice}
          isReceipt={isReceipt}
        />
      )}
    </div>
  );
};
billing.layout = "Contentlayout";

export default billing;
