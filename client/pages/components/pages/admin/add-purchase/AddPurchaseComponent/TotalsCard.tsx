//@ts-check
import { useGetSupplierById } from "@/api-hooks/supplier/use-get-single-supplier-by-id";
import { AddPurchaseSchemaType } from "@/lib/apiValidations";
import { formatNumber } from "@/lib/helpers/formatNumber";
import NumberFieldControlled from "@/pages/components/admin/FormControlledFields/NumberFieldControlled";
import { usePurchase } from "@/shared/store/usePurchaseStore";
import React, { useEffect } from "react";

import { useFormContext } from "react-hook-form";
import { CiCalculator1 } from "react-icons/ci";

function TotalsCard() {
  const { control, setValue } = useFormContext<AddPurchaseSchemaType>();
  const {
    totals,
    tva,
    setTVA,
    setLebaneseTva,
    invoiceDetails: { supplier: supplierOption },
    payment: { amount, amountLbp },
    usdRate,
    addPayment,
    setUsdRate,
  } = usePurchase();

  const { data: supplier } = useGetSupplierById({
    supplierId: supplierOption?.value || "",
  });

  useEffect(() => {
    setUsdRate(90000);
  }, []);

  const tvaAmountInDollars = Number(
    ((totals.totalAmount * tva) / 100)?.toFixed(2)
  );
  const supplierAmountDue = Number(
    (
      supplier?.loan ||
      0 + totals.totalAmount - (amount + (amountLbp || 0) / usdRate)
    )?.toFixed(2)
  );
  console.log("SUPPLIER AMOUNT DUE : ", supplierAmountDue);

  return (
    <div className="border p-4 shadow-sm h-100" style={{ borderRadius: "8px" }}>
      <div className="grid grid-cols-12  items-center mb-1">
        <div className="col-span-2 ">TVA(%)</div>
        <div className="col-span-7">
          <NumberFieldControlled
            control={control}
            name="vatPercent"
            onChangeValue={(value) => {
              setTVA(value as unknown as number);
            }}
            colSpan={12}
            prefix="%"
          />
        </div>

        <div className="fw-bold text-black col-span-1 ">
          = ${isNaN(tvaAmountInDollars) ? 0 : tvaAmountInDollars}
        </div>
      </div>

      <div className="grid grid-cols-12 mb-4 items-center fw-bold text-black ">
        <div className="col-span-2 ">=LBP</div>
        <div className="col-span-7">
          <NumberFieldControlled
            control={control}
            name="vatLBP"
            onChangeValue={(value) => {
              setLebaneseTva(value as unknown as number);
            }}
            colSpan={12}
            prefix="LBP"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            const lebaneseTva = computeLebaneseTva(
              totals.totalAmount,
              tva,
              usdRate
            );
            setValue("vatLBP", lebaneseTva);
          }}
          className="btn col-span-1"
        >
          <CiCalculator1 />
        </button>
      </div>

      <div className="col-span-12 grid grid-cols-2">
        <NumberFieldControlled
          control={control}
          name="amountPaid"
          label="Amount Paid"
          colSpan={12}
          onChangeValue={(value) => {
            addPayment({
              amount: Number(value),
            });
          }}
          prefix="$"
        />
      </div>
      <p
        className={`${
          supplier?._id && supplierAmountDue < 0
            ? "text-success"
            : "text-danger"
        }  fw-bold`}
      >
        {supplier?._id ? (
          <div>
            <span className="text-black">Supplier:</span> {supplier.name}
            <span className="text-muted"> - </span>
            <span className="text-black">Total Amount Due</span> $
            {supplier ? formatNumber(supplierAmountDue, 2) : "0"}
          </div>
        ) : (
          "Please select a supplier"
        )}
      </p>
      <div className="">
        <div className="">
          <span>Total Purchase Amount </span>
          <span className="">${formatNumber(totals.totalAmount, 2)}</span>
        </div>
        <div className="">
          <span>Paid </span>
          <span className="text-success fs-20">
            ${formatNumber(totals.totalAmountPaid, 2)}
          </span>
        </div>

        {/* <div className="">
          <span>Paid LBP</span>
          <span className="text-success fs-20">
            L.L. {formatNumber(totals.totalAmountPaidLbp, 2)}
          </span>
        </div> */}
      </div>
    </div>
  );
}

export default TotalsCard;

function computeLebaneseTva(
  totalAmount: number,
  tva: number,
  usdRate: number
): number {
  return parseFloat((((totalAmount * tva) / 100) * usdRate).toFixed(2));
}
