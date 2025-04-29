"use client"
import React, { Suspense } from "react";

import InvoicesSummary from "../components/pages/admin/dashboard/invoicesSummary";
// import StatementPrinting from "../components/pages/admin/common/StatementPrinting";

const Dashboard = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
     <InvoicesSummary />
    </Suspense>
  );
};

Dashboard.layout = "Contentlayout";
export default Dashboard;
