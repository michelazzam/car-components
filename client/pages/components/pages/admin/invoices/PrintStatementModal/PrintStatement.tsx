import React from "react";

import { dateTimeToDateFormat } from "@/lib/helpers/formatDate";
import {
  OrganizationInfoType,
  useGetOrganization,
} from "@/api-hooks/restaurant/use-get-organization-info";
import { Invoice } from "@/api-hooks/invoices/useListInvoices";
import { useGetUsdRate } from "@/api-hooks/usdRate/use-get-usdRate";
import { formatNumber } from "@/lib/helpers/formatNumber";
import Image from "next/image";

function PrintStatement({
  invoiceRef,
  printingInvoices,
  printA5,
  startDate,
  endDate,
  currency,
  customerDetails = true,
}: {
  invoiceRef: React.RefObject<HTMLDivElement>;
  printingInvoices: Invoice[];
  noTax: boolean;
  printA5: boolean;
  startDate: Date;
  endDate: Date;
  currency: "lbp" | "usd" | "usd_vat";
  customerDetails?: boolean;
}) {
  // ------------------- API calls -------------------
  const { data: restaurant } = useGetOrganization();
  const { data: rate } = useGetUsdRate();
  const usdRate = rate?.usdRate;

  return (
    <div className=" my-5 border rounded-lg h-100 border-gray-500">
      <div
        ref={invoiceRef}
        className="card"
        style={{
          width: printA5 ? "800px" : "auto",
        }}
      >
        {/* Loader */}
        {!restaurant ? (
          <div className=" ">Loader</div>
        ) : (
          <div className=" m-2 p-3 flex flex-col justify-between">
            <div>
              {/* header */}
              <PrintHeader
                organization={restaurant}
                title={"Statement"}
                startDate={startDate}
                endDate={endDate}
              />

              {/* details about the invoice */}
              {customerDetails && (
                <PrintStatementDetails
                  // organization={restaurant}
                  printingInvoices={printingInvoices}
                />
              )}

              {/* the table of items */}
              <InvoicesTable
                usdRate={Number(usdRate)}
                currency={currency}
                printingInvoices={printingInvoices}
              />
            </div>

            {/* subtotol , discount , tax and total, __ remaining */}

            <div>
              <InvoiceSubtotal
                printingInvoices={printingInvoices}
                currency={currency}
                usdRate={Number(usdRate)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const PrintHeader = ({
  title,
  organization,
  startDate,
  endDate,
}: {
  title: string;
  organization: OrganizationInfoType;
  startDate: Date;
  endDate: Date;
}) => (
  <div className="flex justify-between p-4 border-b border-gray-200">
    <div className="col-span-6">
      <h4 className="text-lg font-semibold">{organization?.name}</h4>
      <p className="text-sm space-y-1">
        {organization?.phoneNumber}
        <br />
        {/* {organization?.landline}
        <br /> */}
        {organization?.email}
        <br />
        {organization?.address}
        <span className="block text-xs mt-2 font-bold">
          VAT # {organization?.tvaNumber}
        </span>
      </p>
    </div>
    <div className="col-span-2">
      <Image
        width={100} // Updated to match the other header's size
        height={100}
        src="/assets/images/brand-logos/logo_thermobox.jpg"
        alt="Organization Logo"
        // className="w-full object-cover"
      />
    </div>
    <div className="col-span-4 justify-start">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-xs">
          From {dateTimeToDateFormat(startDate.toString())} to{" "}
          {dateTimeToDateFormat(endDate.toString())}
        </p>
      </div>
    </div>
  </div>
);

const PrintStatementDetails = ({
  printingInvoices,
}: // organization,
{
  printingInvoices: Invoice[];
  // organization: OrganizationInfoType;
}) => {
  const { customer } = (printingInvoices && printingInvoices[0]) || {};

  return (
    <div className="grid grid-cols-12 p-4">
      <div className="col-span-4">
        <p>
          <span className="font-light text-gray-600">Customer:</span>
          <br />
          <h4 className="text-lg font-semibold">{customer?.name}</h4>
          {customer?.address && (
            <h4 className="text-xs">
              Address <span className="font-bold">{customer?.address}</span>
            </h4>
          )}
          {customer?.phone && (
            <h4 className="text-xs">
              Phone <span className="font-bold">{customer?.phone}</span>
            </h4>
          )}
          {customer?.tvaNumber && (
            <h4 className="text-xs">
              FN# <span className="font-bold">{customer?.tvaNumber}</span>
            </h4>
          )}
        </p>
      </div>
      <div className="col-span-8 flex justify-end">
        <p>
          <span className="font-bold">
            Date: {dateTimeToDateFormat(new Date().toString())}
          </span>
          <br />
          {/* This assumes you have a relevant 'createdAt' date for statements, which might not always be the case. If each statement relates to multiple invoices, you might consider showing a date range or omitting this entirely. */}
        </p>
      </div>
    </div>
  );
};

const InvoicesTable = ({
  printingInvoices,
  currency,
  usdRate: accountingUsdRate,
}: {
  printingInvoices: Invoice[];
  currency: "lbp" | "usd" | "usd_vat";
  usdRate: number;
}) => {
  let usdRate = accountingUsdRate;
  return (
    <div className="mt-4 flex flex-col">
      <div className="flex-1 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-200 border-b-2 border-gray-500">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Invoice
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Amount
              </th>

              {/* {currency === "usd_vat" && ( */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                VAT
              </th>
              {/* )} */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Paid
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {printingInvoices.map((invoice, index) => {
              usdRate = invoice.usdRate || accountingUsdRate;
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    TB{invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {invoice.generalNote || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {currency === "lbp"
                      ? ` L.L${formatNumber(
                          invoice.totalPriceLbp ||
                            invoice.totalPriceUsd * usdRate,
                          2
                        )}`
                      : ` $${formatNumber(invoice.totalPriceUsd, 2)}`}
                  </td>

                  {/* {currency === "usd_vat" && ( */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    L.L{formatNumber(invoice.taxesLbp)}
                  </td>
                  {/* )} */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.isPaid ? (
                      <div className="flex-col gap-1">
                        <p>
                          {invoice.amountPaidUsd
                            ? "$" + formatNumber(invoice.amountPaidUsd, 2)
                            : ""}
                        </p>
                        <p>
                          {invoice.amountPaidLbp
                            ? "L.L" + formatNumber(invoice.amountPaidLbp, 2)
                            : ""}
                        </p>
                      </div>
                    ) : (
                      "Not Paid"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InvoiceSubtotal = ({
  printingInvoices,
  currency,
  usdRate: accountingUsdRate,
}: {
  usdRate: number;
  currency: "lbp" | "usd" | "usd_vat";
  printingInvoices: Invoice[];
}) => {
  const totalAmount = printingInvoices.reduce(
    (acc, invoice) =>
      acc +
      (currency === "usd"
        ? invoice.totalPriceUsd +
          invoice.taxesLbp / (invoice.usdRate || accountingUsdRate)
        : currency === "usd_vat"
        ? invoice.totalPriceUsd
        : invoice.totalPriceUsd * (invoice.usdRate || accountingUsdRate) +
          invoice.taxesLbp),
    0
  );
  const totalTaxes = printingInvoices.reduce(
    (acc, invoice) => acc + invoice.taxesLbp,
    0
  );
  const totalPaidAmount = printingInvoices.reduce(
    (acc, invoice) =>
      acc +
      (currency === "usd" || currency === "usd_vat"
        ? invoice.amountPaidUsd +
          invoice.amountPaidLbp / (invoice.usdRate || accountingUsdRate)
        : invoice.amountPaidUsd * (invoice.usdRate || accountingUsdRate) +
          invoice.amountPaidLbp),
    0
  );

  return (
    <div className="flex justify-end mt-4">
      <div className="grid grid-cols-2 gap-4 w-full max-w-4xl  mx-2">
        <div className={` col-span-1  rounded-lg p-4`}></div>
        <div className="col-span-1 border-grey border rounded-lg p-4">
          <div className="flex justify-between">
            <span className="font-semibold">Total Amount: </span>
            <span>
              {currency === "lbp"
                ? ` L.L${formatNumber(totalAmount)}`
                : ` $${formatNumber(totalAmount, 2)}`}
            </span>
          </div>
          {currency === "usd_vat" && (
            <div className="flex justify-between">
              <span className="font-semibold">Total VAT:</span>
              <span>L.L{formatNumber(totalTaxes)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-semibold">Total Paid:</span>
            <span>
              {currency === "lbp"
                ? `L.L${formatNumber(totalPaidAmount)}`
                : `$${formatNumber(totalPaidAmount, 2)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintStatement;
