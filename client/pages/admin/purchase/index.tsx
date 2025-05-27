import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React from "react";
import Link from "next/link";
import { usePurchase } from "@/shared/store/usePurchaseStore";
import PurchaseTable from "@/components/pages/admin/purchase/PurchaseTable";

const PurchasePage = () => {
  const { setEditingPurchase, clearPurchase } = usePurchase();

  //---------------Create Columns--------------------

  return (
    <div>
      <Seo title={"Purchases List"} />
      {/* back btn to the products list */}

      <div className="flex justify-between items-center">
        <Pageheader currentpage="Purchases List" withBreadCrumbs={false} />
        <Link
          onClick={() => {
            setEditingPurchase(undefined);
            clearPurchase();
          }}
          className="ti-btn ti-btn-primary-full ti-btn-wave rounded-md"
          href={"/admin/purchase/add-edit-purchase"}
        >
          Add Purchase
        </Link>
      </div>
      <PurchaseTable />
    </div>
  );
};

PurchasePage.layout = "Contentlayout";
export default PurchasePage;
