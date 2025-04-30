import CustomAddPurchaseComponent from "@/components/pages/admin/add-purchase/AddPurchaseComponent";
import React from "react";

function AddEditPurchasePage() {
  return (
    <div>
      <CustomAddPurchaseComponent />
    </div>
  );
}

AddEditPurchasePage.layout = "Contentlayout";
export default AddEditPurchasePage;
