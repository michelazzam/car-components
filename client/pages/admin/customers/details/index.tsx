import React, { Suspense, useState } from "react";
import { useRouter } from "next/router";
import TableVehicles from "../../../components/pages/admin/vehicles/VehicleTalbe";
import CustomerHeader from "../../../components/pages/admin/customers/customerDetails/Header";
import ListInvoice from "@/pages/components/pages/admin/invoices/ListInvoice";
import { useGetCustomerById } from "@/api-hooks/customer/use-get-customer-by-id";

const CustomerDetails = () => {
  const [view, setView] = useState<"invoices" | "vehicles">("invoices");

  const router = useRouter();
  const { customerId, cN, cE, cP } = router.query;

  const customerName = cN as string;
  const customerPhone = cP as string;
  const customerEmail = cE as string;
  const { data: customer } = useGetCustomerById({
    customerId: customerId as string,
  });
  if (!customer) return <div>Loading...</div>;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {typeof customerName === "string" && typeof customerId === "string" && (
        <CustomerHeader
          customerName={customerName}
          customerPhone={customerPhone}
          customerEmail={customerEmail}
          customerId={customerId}
          view={view}
        />
      )}
      <div className="flex gap-3 items-center border-b-2 border-gray-300 mb-3">
        <button
          className={`text-gray-500 text-lg font-bold p-3 border-b-2  ${
            view === "invoices"
              ? "text-gray-950 border-gray-500"
              : "border-transparent"
          }`}
          onClick={() => {
            view !== "invoices" && [setView("invoices")];
          }}
        >
          Invoices
        </button>
        <button
          className={`text-gray-500 font-bold p-3 text-lg border-b-2  ${
            view === "vehicles"
              ? "text-gray-950 border-gray-500"
              : "border-transparent"
          }`}
          onClick={() => {
            !(view === "vehicles") && [setView("vehicles")];
          }}
        >
          Vehicles
        </button>
      </div>
      {typeof customerId === "string" ? (
        view === "vehicles" ? (
          <TableVehicles customer={customer} />
        ) : (
          <ListInvoice customerId={customerId} />
        )
      ) : null}
    </Suspense>
  );
};

CustomerDetails.layout = "Contentlayout";
export default CustomerDetails;
