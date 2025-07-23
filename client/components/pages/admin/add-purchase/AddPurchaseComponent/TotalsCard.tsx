import { useGetOrganization } from "@/api-hooks/restaurant/use-get-organization-info";
import { useGetSupplierById } from "@/api-hooks/supplier/use-get-single-supplier-by-id";
import { useGetUsdRate } from "@/api-hooks/usdRate/use-get-usdRate";
import { formatNumber } from "@/lib/helpers/formatNumber";
import { usePurchaseFormStore } from "@/shared/store/usePurchaseStore";
import React, { useEffect } from "react";
import { CiCalculator1 } from "react-icons/ci";
import NumberField from "@/components/admin/Fields/NumberField";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

function TotalsCard() {
  //----------------------------------API CALLS--------------------------------------
  const { data: organization } = useGetOrganization();
  const vat = organization?.tvaPercentage || 0;

  //----------------------------------FORM--------------------------------------

  //----------------------------------STORE--------------------------------------
  const {
    roundTotalPurchaseAmount,
    formValues: {
      totalPaid,
      subTotal,
      totalWithTax,
      vatLBP,
      paymentAmount,
      tvaPercent,
      supplier: selectedSupplier,
    },

    setFieldValue,
  } = usePurchaseFormStore();

  const { data: supplier } = useGetSupplierById({
    supplierId: selectedSupplier?.value || "",
  });
  const { data: usdRateData } = useGetUsdRate();

  //----------------------------------EFFECTS--------------------------------------
  useEffect(() => {
    if (usdRateData) setFieldValue("usdRate", usdRateData?.usdRate);
  }, [usdRateData]);

  useEffect(() => {
    if (vat) setFieldValue("tvaPercent", Number(vat));
  }, [organization]);

  //----------------------------------CONSTANTS--------------------------------------
  const tvaAmountInDollars = (subTotal * Number(tvaPercent)) / 100;
  const supplierAmountDue = Number(
    (supplier?.loan || 0 + subTotal - totalPaid)?.toFixed(2)
  );
  // const totalPurchaseAmount = tvaAmountInDollars + subTotal;
  return (
    <div className=" p-4 h-100" style={{ borderRadius: "8px" }}>
      <div className="flex items-center gap-x-4  mb-1">
        <div className="col-span-2 ">TVA</div>
        <div className="col-span-7">
          <NumberField
            marginBottom="mb-0"
            value={tvaPercent}
            onChange={(value) => {
              setFieldValue("tvaPercent", value as unknown as number);
            }}
            colSpan={12}
            prefix="%"
          />
        </div>

        <div className="fw-bold text-black col-span-1 ">
          = ${isNaN(tvaAmountInDollars) ? 0 : tvaAmountInDollars.toFixed(4)}
        </div>
      </div>

      <div className="flex items-center gap-x-4">
        <div className="col-span-2">{"(LL)"}</div>
        <div className="col-span-7">
          <NumberField
            marginBottom="mb-0"
            value={vatLBP}
            onChange={(value) => {
              setFieldValue("vatLBP", value as unknown as number);
            }}
            colSpan={12}
            prefix="LBP "
          />
        </div>

        <button
          type="button"
          onClick={() => {
            const lebaneseTva = computeLebaneseTva(
              subTotal,
              tvaPercent,
              usdRateData?.usdRate || 0
            );
            setFieldValue("vatLBP", lebaneseTva);
          }}
          className="ti-btn ti-btn-outline-primary col-span-1"
        >
          <CiCalculator1 size={20} />
        </button>
      </div>

      <div className="col-span-12 grid grid-cols-2">
        <NumberField
          marginBottom="mb-0"
          value={paymentAmount}
          onChange={(value) => {
            setFieldValue("paymentAmount", Number(value) || 0);
          }}
          label="Amount Paid"
          colSpan={12}
          prefix="$"
        />
      </div>
      <div
        className={`${
          supplier?._id && supplierAmountDue < 0
            ? "text-success"
            : "text-danger"
        }  fw-bold mt-4"`}
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
      </div>
      <div className="mt-2">
        <div className="text-gray-600 flex justify-between ">
          <span>Subtotal </span>
          <span className="">${formatNumber(subTotal, 2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total (with TVA) </span>
          <span className="">${formatNumber(totalWithTax, 2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Paid </span>
          <span className="text-success fs-20">
            ${formatNumber(totalPaid, 2)}
          </span>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-x-2">
            <span>Remaining (for this purchase) </span>
            <button
              type="button"
              className="hover:text-success"
              onClick={() => roundTotalPurchaseAmount("roundUp")}
            >
              <FaArrowUp />
            </button>
            <button
              type="button"
              className="hover:text-danger"
              onClick={() => roundTotalPurchaseAmount("roundDown")}
            >
              <FaArrowDown />
            </button>
          </div>

          <span className="text-danger fs-20">
            ${formatNumber(totalWithTax - totalPaid, 2)}
          </span>
        </div>
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
