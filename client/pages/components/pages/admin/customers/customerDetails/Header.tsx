import React from "react";
import StatementPrinting from "../../common/StatementPrinting";
import { HAS_STATEMENT } from "@/constants/preferences";

const CustomerHeader = ({
  view,
  customerName,
  customerId,
  customerPhone,
}: // customerEmail,
{
  view: "invoices" | "vehicles";
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerId: string;
}) => {
  return (
    <div className="block justify-between page-header md:flex h-24">
      <div>
        <p className="font-bold  text-lg capitalize">{`${customerName}`}</p>
        <span className="text-base">{`+${customerPhone}`}</span>
      </div>
      {view === "invoices" ? (
        <div>
          {HAS_STATEMENT && <StatementPrinting customerId={customerId} />}
        </div>
      ) : (
        <button
          className="ti-btn ti-btn-primary-full ti-btn-wave my-2"
          data-hs-overlay="#add-vehicle-modal"
        >
          Add Vehicles
        </button>
      )}
    </div>
  );
};

CustomerHeader.layout = "Contentlayout";
export default CustomerHeader;
