import Seo from "@/shared/layout-components/seo/seo";
import React, { Suspense } from "react";

import ListInvoice from "../../components/pages/admin/invoices/ListInvoice";
import StatementPrinting from "../../components/pages/admin/common/StatementPrinting";
import { HAS_STATEMENT } from "@/constants/preferences";
// import StatementPrinting from "../components/pages/admin/common/StatementPrinting";

const Invoices = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <Seo title={"Customer List"} />
        <div className="block justify-between page-header md:flex">
          <div>
            <h3 className="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white dark:hover:text-white text-[1.125rem] font-semibold">
              Invoices List
            </h3>
          </div>

          {HAS_STATEMENT && <StatementPrinting />}
        </div>

        <ListInvoice />
      </div>
    </Suspense>
  );
};

Invoices.layout = "Contentlayout";
export default Invoices;
