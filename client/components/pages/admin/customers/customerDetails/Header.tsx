import React from "react";
import StatementPrinting from "../../common/StatementPrinting";
import { HAS_STATEMENT } from "@/constants/preferences";
import { SingleCustomer } from "@/api-hooks/customer/use-get-customer-by-id";
import BackBtn from "@/components/common/BackBtn";

const CustomerHeader = ({
  view,
  customer,
}: {
  view: "invoices" | "vehicles";
  customer: SingleCustomer;
}) => {
  return (
    <main className="mt-5">
      <BackBtn />

      <div className="block justify-between py-3 md:flex bg-red-200">
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
    </main>
  );
};

CustomerHeader.layout = "Contentlayout";
export default CustomerHeader;
