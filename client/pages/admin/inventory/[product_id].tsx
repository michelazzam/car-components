import { useGetProductById } from "@/api-hooks/products/use-get-product-by-id";
import ListInvoice from "@/components/pages/admin/invoices/ListInvoice";
import ListPurchase from "@/components/pages/admin/purchase/ListPurchase";
import { useRouter } from "next/router";
import React, { Suspense, useState } from "react";

const ProductDetails = () => {
  const [view, setView] = useState<"invoices" | "suppliers">("invoices");

  const router = useRouter();
  const { product_id } = router.query;

  const {
    data: item,
    isPending,
    error,
  } = useGetProductById({
    productId: product_id as string,
  });
  if (error) return <div>Error</div>;
  if (isPending) return <div>Loading...</div>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* {customer && <CustomerHeader customer={customer} view={view} />} */}
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
            view === "suppliers"
              ? "text-gray-950 border-gray-500"
              : "border-transparent"
          }`}
          onClick={() => {
            !(view === "suppliers") && [setView("suppliers")];
          }}
        >
          Suppliers
        </button>
      </div>
      {view === "suppliers" ? (
        <ListPurchase productId={product_id as string} product={item} />
      ) : (
        <ListInvoice productId={product_id as string} product={item} />
      )}
    </Suspense>
  );
};
ProductDetails.layout = "Contentlayout";

export default ProductDetails;
