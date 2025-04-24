import React, { useMemo } from "react";

import { dateTimeToDateFormat } from "@/lib/helpers/formatDate";

import {
  Invoice,
  ProductItem,
  ServiceItem,
} from "@/api-hooks/invoices/useListInvoices";
import { formatNumber } from "@/lib/helpers/formatNumber";
import { useGetUsdRate } from "@/api-hooks/usdRate/use-get-usdRate";
import Image from "next/image";
import numWords from "num-words";
import {
  CustomerPrev,
  InvoicePreviewItem,
  PreviewInvoice,
  VehiclePrev,
} from ".";
import {
  OrganizationInfoType,
  useGetOrganization,
} from "@/api-hooks/restaurant/use-get-organization-info";

const formatCurrencyInWords = (amount: number) => {
  if (typeof amount !== "number" || isNaN(amount)) return "0.00";
  const dollars = Math.floor(amount);
  const cents = Math.round((amount - dollars) * 100);
  return `${numWords(dollars)} dollar${dollars !== 1 ? "s" : ""} ${
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
  previewingInvoice?: PreviewInvoice;
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
    invoiceNum,
    createdAt,
    services,
    products,
    discount,
    paidAmountUsd,
    // amountPaidLbp,
    taxesLbp,
    customerNote,
    totalPriceUsd,
    usdRate: invoiceUsdRate,
  } = useMemo(() => {
    const invoiceData = prev ? previewingInvoice : printingInvoice;
    if (!invoiceData) return {};

    const calculatedTaxesUsd =
      invoiceData.taxesLbp /
      Number(invoiceData.usdRate || usdRate?.usdRate || 1);
    const finalPrice = printingInvoice?.finalPriceUsd || 0;
    const totalPrice = prev ? invoiceData.totalPriceUsd : finalPrice;

    return {
      customer: invoiceData.customer,
      vehicle: invoiceData.vehicle,
      taxesUsd: calculatedTaxesUsd,
      invoiceNum: invoiceData.invoiceNumber,
      createdAt: printingInvoice?.createdAt,
      services: invoiceData.services,
      products: invoiceData.products?.map((item) => ({
        type: "product",
        //@ts-ignore
        name: prev ? item.name : item.product.name,
        quantity: item.quantity,
        //@ts-ignore
        price: prev ? item.price : item.product.price,
        amount: prev ? (item.quantity || 0) * (item.price || 0) : item.amount,
      })),
      discount: invoiceData.discount,
      paidAmountUsd: invoiceData.paidAmountUsd,
      // amountPaidLbp: invoiceData.amountPaidLbp,
      taxesLbp: invoiceData.taxesLbp,
      customerNote: invoiceData.customerNote,
      totalPriceUsd: totalPrice,
      usdRate:
        usdRate?.usdRate ||
        invoiceData.totalPriceLbp / invoiceData.totalPriceUsd,
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
          />
          <PrintInvoiceDetails
            customer={customer}
            vehicle={vehicle}
            invoiceNumber={invoiceNum}
            createdAt={createdAt}
            invoiceUsdRate={invoiceUsdRate || usdRate.usdRate}
          />
          <InvoiceTable services={services} products={products} />
          <InvoiceSubtotal
            discount={discount}
            products={products}
            services={services}
            customerNote={customerNote}
            amountPaidUsd={paidAmountUsd}
            // amountPaidLbp={amountPaidLbp}
            taxesLbp={taxesLbp}
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
  noTax,
}: {
  title: string;
  organization: OrganizationInfoType;
  noTax: boolean;
}) => (
  <div
    className="
  flex justify-between px-4 py-2 border-b border-gray-200"
  >
    <div className="col-span-4">
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
        {noTax !== false && (
          <span className="block text-xs mt-2 font-bold">
            VAT # {organization?.tvaNumber}
          </span>
        )}
      </p>
    </div>
    <div className="col-span-2">
      <Image
        width={100}
        height={100}
        src="/assets/images/brand-logos/logo_thermobox.jpg"
        alt="organization Logo"
        // className="w-full object-cover"
      />
    </div>
    <div className="col-span-4">
      <h3 className="text-2xl font-bold">{title}</h3>
    </div>
  </div>
);

const PrintInvoiceDetails = ({
  customer,
  vehicle,
  invoiceNumber,
  createdAt,
  invoiceUsdRate,
}: {
  customer?: CustomerPrev;
  vehicle?: VehiclePrev;
  invoiceNumber?: number;
  createdAt?: string;
  invoiceUsdRate: number;
}) => (
  <div className="grid grid-cols-12 px-4 py-2">
    {/* Customer and Vehicle Details */}
    <div className="col-span-4">
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
        {customer?.phone && (
          <h4 className="text-xs">
            Phone <span className="font-bold">{customer.phone}</span>
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
                Vehicle Model <span className="font-bold">{vehicle.model}</span>
              </h4>
            )}
          </>
        )}
      </p>
    </div>
    <div className="col-span-8 flex justify-end">
      <p>
        {invoiceNumber ? (
          <span className="font-bold">Invoice # TB{invoiceNumber}</span>
        ) : null}
        <br />
        {/* <span className="font-bold">
          Date: {dateTimeToDateFormat(new Date().toString())}
        </span>
        <br /> */}
        {createdAt && (
          <span className="font-bold">
            Date: {dateTimeToDateFormat(createdAt)}
            <br />
          </span>
        )}

        <span className="font-bold">
          VAT Rate: 1$ = {formatNumber(invoiceUsdRate, 0)}LBP
        </span>
      </p>
    </div>
  </div>
);
const InvoiceTable = ({
  products,
  services,
}: {
  products?: InvoicePreviewItem[];
  services?: InvoicePreviewItem[];
}) => {
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products &&
              products?.map((item, index) => (
                <ProductTableRow
                  product={{
                    name: item?.name || "",
                    price: item?.price || 0,
                    quantity: item.quantity || 1,
                  }}
                  key={index}
                />
              ))}
            {services && services?.length > 0 && (
              <>
                {services.map((item, index) => (
                  <ServiceTableRow
                    service={{
                      name: item.name || "Unnamed Service",
                      quantity: item.quantity || 1,
                      price: item.price || 0,
                    }}
                    key={index}
                  />
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductTableRow = ({ product }: { product: ProductItem }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-black">
        {product.name}
      </td>
      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
        {formatNumber(product.quantity)}
      </td>
      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
        ${formatNumber(product.price || 0)}
      </td>
      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
        ${formatNumber((product.price || 0) * product.quantity)}
      </td>
    </tr>
  );
};

const ServiceTableRow = ({ service }: { service: ServiceItem }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-black">
        {service.name}
      </td>
      {
        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
          {formatNumber(service.quantity || 0)}
        </td>
      }
      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
        ${formatNumber(service.price)}
      </td>
      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
        ${formatNumber(service.price * Number(service.quantity))}
      </td>
    </tr>
  );
};

const InvoiceSubtotal = ({
  discount,
  products,
  services,
  amountPaidUsd,
  amountPaidLbp,
  taxesLbp,
  customerNote,
  taxesUsd,
  taxPercentage,
}: {
  discount?: {
    amount: number;
    type: "fixed" | "percentage";
  };
  products?: InvoicePreviewItem[];
  services?: InvoicePreviewItem[];
  amountPaidUsd?: number;
  amountPaidLbp?: number;
  taxesLbp?: number;
  customerNote?: string;
  taxesUsd?: number;
  taxPercentage?: number;
}) => {
  const productPrice =
    products?.reduce(
      (acc, curr) => acc + Number(curr?.price) * Number(curr?.quantity),
      0
    ) || 0;
  const servicePrice =
    services?.reduce(
      (acc, curr) => acc + Number(curr?.price) * Number(curr?.quantity),
      0
    ) || 0;

  const subTotal = productPrice + servicePrice;

  const total = () => {
    if (!discount) return subTotal;
    return discount.type === "fixed"
      ? subTotal - discount.amount
      : subTotal - subTotal * discount.amount * 0.01;
  };

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
            <span>${formatNumber(subTotal, 2)}</span>
          </div>
          {discount && discount.amount > 0 && (
            <div className="flex justify-between text-red-500">
              <span className="font-semibold">Discount:</span>
              <span>
                {discount.type === "fixed" ? "$" : "%"}
                {formatNumber(discount.amount, 2)}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="font-semibold">VAT {taxPercentage}% (USD):</span>
            <span>${taxesUsd ? formatNumber(taxesUsd, 2) : 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">VAT {taxPercentage}% (LBP):</span>
            <span>L.L{taxesLbp ? formatNumber(taxesLbp, 0) : 0}</span>
          </div>

          <div className="flex justify-between text-green-600">
            <span className="font-semibold">Total:</span>
            <span>${taxesUsd ? formatNumber(total() + taxesUsd, 2) : 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Paid (USD):</span>
            <span>${amountPaidUsd ? formatNumber(amountPaidUsd, 2) : 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Paid (LBP):</span>
            <span>L.L{amountPaidLbp ? formatNumber(amountPaidLbp, 0) : 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintInvoice;
