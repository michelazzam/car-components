//@ts-check
import { useGetSupplierById } from "@/api-hooks/supplier/use-get-single-supplier-by-id";
import { formatNumber } from "@/lib/helpers/formatNumber";
import { usePurchase } from "@/shared/store/usePurchaseStore";
import React, { useEffect } from "react";

import CurrencyInput from "react-currency-input-field";

function TotalsCard() {
  const {
    products,
    totals,
    tva,
    setTVA,
    lebaneseTva,
    setLebaneseTva,
    calculateLebaneseTVA,
    invoiceDetails: { supplier: supplierOption },
    payment: { fromCaisse, fromBalance, fromCaisseLbp },
    usdRate,
  } = usePurchase();

  const { data: supplier } = useGetSupplierById({
    supplierId: supplierOption?.value || "",
  });

  useEffect(() => {}, [tva]);

  const tvaAmountInDollars = Number(
    ((totals.totalAmount * tva) / 100)?.toFixed(2)
  );
  const supplierAmountDue = Number(
    (
      supplier?.amountDue ||
      0 +
        totals.totalAmount -
        (fromCaisse + fromBalance + fromCaisseLbp / usdRate)
    )?.toFixed(2)
  );

  return (
    <div className="border p-4 shadow-sm h-100" style={{ borderRadius: "8px" }}>
      <div className="row align-items-center mb-1">
        <div className="col-2 ">TVA(%)</div>
        <div className="col-5">
          <CurrencyInput
            prefix="%"
            readOnly={products.length > 0}
            className="form-control mx-2"
            value={tva}
            onValueChange={(value) => {
              if (typeof value === "number") setTVA(value);
            }}
          />
        </div>
        =
        <div className="fw-bold text-black col-1 ">
          ${isNaN(tvaAmountInDollars) ? 0 : tvaAmountInDollars}
        </div>
      </div>

      <div className="row mb-4 align-items-center fw-bold text-black ">
        <div className="col-2 ">=LBP</div>
        <div className="col-5">
          <CurrencyInput
            prefix="LBP"
            className="form-control mx-2 "
            value={lebaneseTva}
            onValueChange={(value) => {
              if (typeof value === "number") setLebaneseTva(value);
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            calculateLebaneseTVA();
          }}
          className="btn col-1"
        >
          <i className="fa fa-calculator" aria-hidden="true"></i>
        </button>
      </div>
      <p className={`${supplier ? "text-success" : "text-danger"}  fw-bold`}>
        {supplier ? (
          <div>
            <span className="text-black">Supplier:</span> {supplier.name}
            <span className="text-muted"> - </span>
            <span className="text-black">Total Amount Due</span> $
            {supplier
              ? formatNumber(supplierAmountDue > 0 ? supplierAmountDue : 0, 2)
              : "0"}
          </div>
        ) : (
          "Please select a supplier"
        )}
      </p>
      <div className="d-flex ">
        <div className="d-flex flex-column ">
          <span>Total Purchase Amount</span>
          <span className="fw-bold fs-20 text-black">
            ${formatNumber(totals.totalAmount, 2)}
          </span>
        </div>
        <div className="d-flex flex-column ms-2">
          <span>Paid</span>
          <span className="text-success fs-20">
            ${formatNumber(totals.totalAmountPaid, 2)}
          </span>
        </div>

        <div className="d-flex flex-column ms-2">
          <span>Paid LBP</span>
          <span className="text-success fs-20">
            L.L. {formatNumber(totals.totalAmountPaidLbp, 2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TotalsCard;
