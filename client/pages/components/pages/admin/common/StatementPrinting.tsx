import RadioGroup from "@/pages/components/admin/ControlledFields/RadioGroup";
import React, { useState } from "react";
import { useListInvoices } from "@/api-hooks/invoices/useListInvoices";
import useListInvoicesQueryStrings from "@/shared/helper-hooks/useListInvoicesQueryStrings";
import PrintStatementModal from "../invoices/PrintStatementModal";

export default function StatementPrinting({
  customerId,
}: {
  customerId?: string;
}) {
  const { startDate, endDate } = useListInvoicesQueryStrings();
  const [pageSize, setPageSize] = useState(10);

  const { data: invoicesData, isFetching } = useListInvoices({
    customerId: customerId,
    localPageSize: pageSize,
  });
  const invoices = invoicesData?.invoices;
  const totalInvoicesInDB = invoicesData?.totalCount;
  const [showIn, setShowIn] = useState<"lbp" | "usd" | "usd_vat">("usd");

  return (
    <>
      <div className="border border-gray-700 rounded-md flex items-center justify-around gap-4 px-4 py-2">
        <span>show in:</span>
        <RadioGroup
          isFlex={true}
          options={[
            { label: "LBP", value: "lbp" },
            { label: "USD", value: "usd" },
            { label: "USD & VAT in LBP", value: "usd_vat" },
          ]}
          defaultValue={"usd"}
          onChange={(e) => {
            if (e === "usd_vat" || e === "usd" || e === "lbp") {
              setShowIn(e);
            }
          }}
        />

        {/* when the user wants to print, fetch all the available invoices using the totalCount field */}
        <button
          onClick={() => setPageSize(totalInvoicesInDB!)}
          data-hs-overlay="#print-statement-modal"
          className="ti-btn ti-btn-primary-full ti-btn-wave"
        >
          {isFetching ? "Loading..." : "Print Statement"}
        </button>
      </div>

      {invoices && invoices?.length > 0 && (
        <PrintStatementModal
          // if there is no date, show today date
          startDate={startDate ? new Date(startDate) : new Date()}
          endDate={endDate ? new Date(endDate) : new Date()}
          currency={showIn}
          triggerModalId="print-statement-modal"
          title="Print Statement"
          printingInvoices={invoices}
          customerDetails={!!customerId}
        />
      )}
    </>
  );
}
