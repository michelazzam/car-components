import { useGetSupplierById } from "@/api-hooks/supplier/use-get-single-supplier-by-id";
import BackBtn from "@/components/common/BackBtn";
import ExpenseTable from "@/components/pages/admin/expenses/ExpenseTable";
import PurchaseTable from "@/components/pages/admin/purchase/PurchaseTable";
import SupplierHeader from "@/components/pages/admin/supplier/single-supplier/SupplierHeader";
import { useQueryStrings } from "@/hooks/useQueryStrings";
import { useRouter } from "next/router";
import React, { Suspense, useState } from "react";

const SupplierDetails = () => {
  const [view, setView] = useState<"purchases" | "expenses">("purchases");

  const router = useRouter();
  const { supplier_id } = router.query;
  const { resetAllQueriesExcept } = useQueryStrings();
  const {
    data: supplier,
    isPending,
    error,
  } = useGetSupplierById({
    supplierId: supplier_id as string,
  });
  if (error) return <div>Error</div>;
  if (isPending) return <div>Loading...</div>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BackBtn className="mt-3" />
      {supplier && <SupplierHeader supplier={supplier} />}
      <div className="flex gap-3 items-center border-b-2 border-gray-300 mb-3">
        <button
          className={`text-gray-500 text-lg font-bold p-3 border-b-2  ${
            view === "purchases"
              ? "text-gray-950 border-gray-500"
              : "border-transparent"
          }`}
          onClick={() => {
            view !== "purchases" && [setView("purchases")];
            //reset pageIndex and pageSize from the pagination router
            resetAllQueriesExcept(["supplier_id"]);
          }}
        >
          Purchases
        </button>
        <button
          className={`text-gray-500 font-bold p-3 text-lg border-b-2  ${
            view === "expenses"
              ? "text-gray-950 border-gray-500"
              : "border-transparent"
          }`}
          onClick={() => {
            !(view === "expenses") && [setView("expenses")];
            //reset pageIndex and pageSize from the pagination router
            resetAllQueriesExcept(["supplier_id"]);
          }}
        >
          Expenses
        </button>
      </div>
      {view === "expenses" ? (
        <ExpenseTable selectedSupplier={supplier} />
      ) : (
        <PurchaseTable selectedSupplier={supplier} />
      )}
    </Suspense>
  );
};
SupplierDetails.layout = "Contentlayout";

export default SupplierDetails;
