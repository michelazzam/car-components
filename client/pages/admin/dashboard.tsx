"use client";
import React, { Suspense } from "react";

import InvoicesSummary from "../components/pages/admin/dashboard/invoicesSummary";
import InventorySummary from "../components/pages/admin/dashboard/InventorySummary";
// import StatementPrinting from "../components/pages/admin/common/StatementPrinting";

const Dashboard = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvoicesSummary />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InventorySummary />
        <div className="bg-gray-100 p-4">Section 2</div>
      </div>
    </Suspense>
  );
};

Dashboard.layout = "Contentlayout";
export default Dashboard;
