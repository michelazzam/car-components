"use client";
import React, { Suspense } from "react";

import InvoicesSummary from "../components/pages/admin/dashboard/invoicesSummary";
import InventorySummary from "../components/pages/admin/dashboard/InventorySummary";
import ProfitAndLossSummary from "../components/pages/admin/dashboard/ProfitAndLossSummary";
// import StatementPrinting from "../components/pages/admin/common/StatementPrinting";

const Dashboard = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvoicesSummary />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <InventorySummary />
        </div>
        <ProfitAndLossSummary />
      </div>
    </Suspense>
  );
};

Dashboard.layout = "Contentlayout";
export default Dashboard;
