"use client";
import React, { Suspense } from "react";
import { motion } from "framer-motion";

import InventorySummary from "../components/pages/admin/dashboard/InventorySummary";
import ProfitAndLossSummary from "../components/pages/admin/dashboard/ProfitAndLossSummary";
import AccountsSummary from "../components/pages/admin/dashboard/AccountsSummary";
import InvoicesSummary from "../components/pages/admin/dashboard/InvoicesSummary";
import SalesProductsSummary from "../components/pages/admin/dashboard/SalesProductsSummary";

// Stagger parent container
const container = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Fade-up animation
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Dashboard = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <motion.div
        variants={container}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        <motion.div variants={fadeUp}>
          <InvoicesSummary />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div variants={fadeUp} className="md:col-span-2">
            <InventorySummary />
          </motion.div>

          <motion.div variants={fadeUp}>
            <ProfitAndLossSummary />
          </motion.div>
        </div>
        <motion.div variants={fadeUp}>
          <AccountsSummary />
        </motion.div>
        <motion.div variants={fadeUp}>
          <SalesProductsSummary />
        </motion.div>
      </motion.div>
    </Suspense>
  );
};

Dashboard.layout = "Contentlayout";
export default Dashboard;
