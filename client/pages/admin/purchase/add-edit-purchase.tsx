import BackBtn from "@/components/common/BackBtn";
import CustomAddPurchaseComponent from "@/components/pages/admin/add-purchase/AddPurchaseComponent";
import React from "react";

function AddEditPurchasePage() {
  return (
    <div className="space-y-3 mt-5">
      <BackBtn />
      <CustomAddPurchaseComponent />
    </div>
  );
}

AddEditPurchasePage.layout = "Contentlayout";
export default AddEditPurchasePage;
