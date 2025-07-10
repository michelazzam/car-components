import React, { useMemo } from "react";

import { dateTimeToDateFormat } from "@/lib/helpers/formatDate";

import {
  Discount,
  GetItem,
  Invoice,
  Swap,
} from "@/api-hooks/invoices/useListInvoices";
import { formatNumber } from "@/lib/helpers/formatNumber";
import { useGetUsdRate } from "@/api-hooks/usdRate/use-get-usdRate";
import numWords from "num-words";
import {
  OrganizationInfoType,
  useGetOrganization,
} from "@/api-hooks/restaurant/use-get-organization-info";
import { InvoicePaymentMethodSchemaType } from "@/lib/apiValidations";
import { cn } from "@/utils/cn";

const formatCurrencyInWords = (amount: number) => {
  if (typeof amount !== "number" || isNaN(amount)) return "0.00";
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);

  const dollars = Math.floor(absoluteAmount);
  const cents = Math.round((absoluteAmount - dollars) * 100);
  return `${isNegative ? "minus " : ""}${numWords(dollars)} dollar${
    dollars !== 1 ? "s" : ""
  } ${
    cents > 0 ? `and ${numWords(cents)} cent${cents !== 1 ? "s" : ""}` : ""
  } only`;
};

function PrintInvoice({
  printingInvoice,
  previewingInvoice,
  noTax,
  printA5,
  prev,
}: {
  printingInvoice?: Invoice;
  previewingInvoice?: Invoice;
  noTax: boolean;
  printA5: boolean;
  prev?: boolean;
}) {
  const { data: organization } = useGetOrganization();
  const { data: usdRate } = useGetUsdRate();

  // Determine which invoice data to use
  const {
    customer,
    vehicle,
    taxesUsd,
    createdAt,
    items,
    discount,
    paidAmountUsd,
    subTotalUsd,
    customerNote,
    totalPriceUsd,
    invoiceUsdRate,
    invoiceNumber,
    type,
    swaps,
    paymentMethods,
  } = useMemo(() => {
    const invoiceData = prev ? previewingInvoice : printingInvoice;
    if (!invoiceData) return {};
    return {
      customer: invoiceData.customer,
      vehicle: invoiceData.vehicle,
      invoiceNumber: invoiceData.number,
      createdAt: printingInvoice?.createdAt,
      items: invoiceData.items,
      discount: invoiceData.accounting.discount,
      paidAmountUsd: invoiceData.accounting.paidAmountUsd,
      subTotalUsd: invoiceData.accounting.subTotalUsd,
      taxesUsd: invoiceData.accounting.taxesUsd,
      customerNote: invoiceData.customerNote,
      totalPriceUsd: invoiceData.accounting.totalUsd,
      invoiceUsdRate: invoiceData.accounting.usdRate,
      type: invoiceData.type,
      swaps: invoiceData.swaps,
      paymentMethods: invoiceData.paymentMethods,
    };
  }, [prev, previewingInvoice, printingInvoice, usdRate]);

  // Check for organization and usdRate load status
  if (!organization || !usdRate) {
    return <div className="p-5 text-center">Loading...</div>;
  }

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden ${
        printA5 ? "max-w-screen-md mx-auto" : "max-w-full"
      }`}
    >
      {!organization ? (
        <div className="p-5 text-center">Loading...</div>
      ) : (
        <div className="flex flex-col">
          <PrintHeader
            noTax={noTax}
            organization={organization}
            title="Invoice"
            invoiceNumber={invoiceNumber}
          />
          <PrintInvoiceDetails
            customer={customer}
            vehicle={vehicle}
            // invoiceNumber={invoiceNum}
            isB2b={type === "s1"}
            createdAt={createdAt}
            invoiceUsdRate={invoiceUsdRate || usdRate.usdRate}
            paymentMethods={paymentMethods}
          />
          {items && <InvoiceTable items={items} />}
          <InvoiceSubtotal
            swaps={swaps}
            discount={discount}
            noTax={noTax}
            subTotalUsd={subTotalUsd || 0}
            totalPriceUsd={totalPriceUsd || 0}
            customerNote={customerNote}
            amountPaidUsd={paidAmountUsd}
            taxesUsd={taxesUsd}
            taxPercentage={organization.tvaPercentage}
          />
          <div className="px-4 py-2 flex justify-center text-xl font-medium text-center">
            <p>
              It is requested from{" "}
              {customer ? `'${customer.name}'` : "the customer"} the amount of{" "}
              <span className="underline capitalize">
                {formatCurrencyInWords(totalPriceUsd || 0)}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const PrintHeader = ({
  title,
  organization,
  invoiceNumber,
  noTax,
}: {
  title: string;
  organization: OrganizationInfoType;
  invoiceNumber?: string;
  noTax: boolean;
}) => (
  <div
    className="
  grid grid-cols-10 px-4 py-2 border-b border-gray-200"
  >
    <div className="col-span-6 flex items-start gap-x-2">
      <img
        src={"/assets/images/brand-logos/logo.jpg"}
        alt="logo"
        className="w-32"
      />
      <div>
        <h4 className="text-lg font-semibold">{organization?.name}</h4>
        <p className="text-sm space-y-1">
          {organization?.phoneNumber}
          <br />

          {organization?.email && (
            <>
              {organization?.email}
              <br />
            </>
          )}
          {organization?.address}
          {!noTax && (
            <span className="block text-xs mt-2 font-bold">
              MOF # {organization?.tvaNumber}
            </span>
          )}
        </p>
      </div>
    </div>

    <div className="col-span-4 flex flex-col items-end">
      <h3 className="text-5xl font-bold">{title} </h3>
      {invoiceNumber && (
        <p className="text-lg text-gray-600">#{invoiceNumber}</p>
      )}
    </div>
  </div>
);

const PrintInvoiceDetails = ({
  customer,
  vehicle,
  invoiceNumber,
  createdAt,
  invoiceUsdRate,
  isB2b,
  paymentMethods,
}: {
  customer?: any;
  vehicle?: any;
  invoiceNumber?: number;
  createdAt?: string;
  invoiceUsdRate: number;
  isB2b: boolean;
  paymentMethods?: InvoicePaymentMethodSchemaType[];
}) => {
  console.log("CUSTOMER IS ", customer);
  const hasPaymentMethods = paymentMethods && paymentMethods?.length > 0;
  return (
    <div className="grid grid-cols-12 px-4 py-2">
      {/* Customer and Vehicle Details */}
      <div className="col-span-8">
        <p>
          <span className="font-light text-gray-600">Customer:</span>
          <br />
          {customer?.name && (
            <h4 className="text-lg font-semibold">{customer.name}</h4>
          )}
          {customer?.address && (
            <h4 className="text-xs">
              Address <span className="font-bold">{customer.address}</span>
            </h4>
          )}
          {customer?.phoneNumber && (
            <h4 className="text-xs">
              Phone <span className="font-bold">{customer.phoneNumber}</span>
            </h4>
          )}
          {customer?.tvaNumber && (
            <h4 className="text-xs">
              FN# <span className="font-bold">{customer.tvaNumber}</span>
            </h4>
          )}
          {vehicle && (
            <>
              {vehicle.vehicleNb && (
                <h4 className="text-xs">
                  Vehicle Number{" "}
                  <span className="font-bold">{vehicle.vehicleNb}</span>
                </h4>
              )}
              {vehicle.model && (
                <h4 className="text-xs">
                  Vehicle Model{" "}
                  <span className="font-bold">{vehicle.model}</span>
                </h4>
              )}
            </>
          )}
        </p>
        {hasPaymentMethods && (
          <span className="font-bold">Payment Methods:</span>
        )}
        {paymentMethods?.map((paymentMethod, index) => {
          return (
            <div key={index} className="flex gap-2">
              <span>{paymentMethod.method}</span>
              <span className="text-gray-500">{paymentMethod.note}</span>
            </div>
          );
        })}
      </div>
      <div className="col-span-4 flex justify-end">
        <p>
          {invoiceNumber ? (
            <span className="font-bold">Invoice # TB{invoiceNumber}</span>
          ) : null}
          <br />
          {createdAt && (
            <span className="font-bold">
              Date: {dateTimeToDateFormat(createdAt)}
              <br />
            </span>
          )}

          <span className="font-bold">
            {isB2b ? "VAT" : "USD"} Rate: 1$ = {formatNumber(invoiceUsdRate, 0)}
            LBP
          </span>
        </p>
      </div>
    </div>
  );
};
const InvoiceTable = ({ items }: { items: GetItem[] }) => {
  return (
    <div className="mt-2 flex flex-col">
      <div className="flex-1 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-200 border-b-2 border-gray-500">
            <tr>
              <th className="px-6 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Unit Price
              </th>
              <th className="px-6 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Discount Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items &&
              items?.map((item, index) => (
                <ProductTableRow
                  product={{
                    name: item?.name || "",
                    price: item?.price || 0,
                    quantity: item.quantity || 1,
                    discount: item.discount,
                    note: item?.note || "",
                  }}
                  key={index}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductTableRow = ({
  product,
}: {
  product: {
    name: string;
    quantity: number;
    price: number;
    note?: string;
    discount?: Discount;
  };
}) => {
  return (
    <>
      <tr>
        <td
          className={cn(
            "px-6  whitespace-nowrap text-sm font-medium text-black align-top",
            product.note ? "pt-2 pb-1" : "py-2"
          )}
        >
          {product.name}
        </td>
        <td
          className={cn(
            "px-6  whitespace-nowrap text-sm text-gray-900 align-top",
            product.note ? "pt-2 pb-1" : "py-2"
          )}
        >
          {formatNumber(product.quantity)}
        </td>
        <td
          className={cn(
            "px-6  whitespace-nowrap text-sm text-gray-900 align-top",
            product.note ? "pt-2 pb-1" : "py-2"
          )}
        >
          ${formatNumber(product.price || 0)}
        </td>
        <td
          className={cn(
            "px-6  whitespace-nowrap text-sm text-gray-900 align-top",
            product.note ? "pt-2 pb-1" : "py-2"
          )}
        >
          ${formatNumber((product.price || 0) * product.quantity)}
        </td>
        <td
          className={cn(
            "px-6  whitespace-nowrap text-sm text-danger align-top",
            product.note ? "pt-2 pb-1" : "py-2"
          )}
        >
          {product.discount
            ? product.discount.type === "percentage"
              ? `%${product.discount.amount}`
              : `$${product.discount.amount}`
            : "$0"}
        </td>
      </tr>
      {product.note && (
        <tr className="!border-none !pt-0">
          <td colSpan={5} className="px-6 pb-1 text-sm text-gray-600">
            {product.note}
          </td>
        </tr>
      )}
    </>
  );
};

const InvoiceSubtotal = ({
  discount,
  swaps,
  amountPaidUsd,
  customerNote,
  taxesUsd,
  taxPercentage,
  subTotalUsd,
  totalPriceUsd,
  noTax,
}: {
  discount?: {
    amount: number;
    type: "fixed" | "percentage";
  };
  swaps?: Swap[];
  amountPaidUsd?: number;
  taxesLbp?: number;
  customerNote?: string;
  taxesUsd?: number;
  taxPercentage?: number;
  subTotalUsd: number;
  totalPriceUsd: number;
  noTax: boolean;
}) => {
  const isSwapAvailable = swaps && swaps?.length > 0;
  const totalSwapsDiscount =
    swaps?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  return (
    <div className="flex justify-end mt-2">
      <div className="grid grid-cols-2 gap-4 w-full max-w-4xl mx-2">
        <div
          className={`${
            customerNote ? "bg-white rounded-lg border-grey border" : ""
          } col-span-1  p-4`}
        >
          {customerNote && (
            <>
              <div className="font-semibold">Note:</div>
              <p>{customerNote}</p>
            </>
          )}
        </div>

        <div className="col-span-1 rounded-lg bg-white border-grey border  p-4 space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold">Sub Total:</span>
            <span>${formatNumber(subTotalUsd, 2)}</span>
          </div>
          {isSwapAvailable && totalSwapsDiscount > 0 && (
            <div className="flex justify-between text-red-500">
              <span className="font-semibold">Swapped By:</span>
              <span>-${formatNumber(totalSwapsDiscount, 2)}</span>
            </div>
          )}

          {discount && discount.amount > 0 && (
            <div className="flex justify-between text-red-500">
              <span className="font-semibold">Discount:</span>
              <span>
                {discount.type === "fixed" ? "$" : "%"}
                {formatNumber(discount.amount, 2)}
              </span>
            </div>
          )}

          {!noTax && (
            <div className="flex justify-between">
              <span className="font-semibold">VAT {taxPercentage}% (USD):</span>
              <span>${taxesUsd ? formatNumber(taxesUsd, 2) : 0}</span>
            </div>
          )}

          <div className="flex justify-between text-green-600">
            <span className="font-semibold">Total:</span>
            <span>${formatNumber(totalPriceUsd, 2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Paid (USD):</span>
            <span>${amountPaidUsd ? formatNumber(amountPaidUsd, 2) : 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PrintInvoice;
