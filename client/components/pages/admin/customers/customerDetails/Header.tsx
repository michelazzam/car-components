import React from "react";
import StatementPrinting from "../../common/StatementPrinting";
import { HAS_STATEMENT } from "@/constants/preferences";
import { SingleCustomer } from "@/api-hooks/customer/use-get-customer-by-id";

const CustomerHeader = ({
  view,
  customer,
}: {
  view: "invoices" | "vehicles";
  customer: SingleCustomer;
}) => {
  return (
    <div className="block justify-between page-header md:flex h-24">
      <section className="flex items-center gap-7">
        <div>
          <p className="font-bold  text-lg capitalize">{`${customer.name}`}</p>
          <span className="text-base">{`+${customer.phoneNumber}`}</span>
        </div>

        {customer.loan > 0 && (
          <div>
            <p className="font-bold text-lg capitalize">Loan</p>
            <span className="text-base">{customer.loan} $</span>
          </div>
        )}
      </section>

      {view === "invoices" ? (
        <div>
          {HAS_STATEMENT && <StatementPrinting customerId={customer._id} />}
        </div>
      ) : (
        <button
          className="ti-btn ti-btn-primary-full ti-btn-wave my-2"
          data-hs-overlay="#add-vehicle-modal"
        >
          Add Vehicle
        </button>
      )}
    </div>
  );
};

CustomerHeader.layout = "Contentlayout";
export default CustomerHeader;
