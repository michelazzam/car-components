import Seo from "@/shared/layout-components/seo/seo";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import RevenueanalyticsProgress from "../components/pages/admin/balance/RevenueanalyticsProgress";
import RecordsTable from "../components/pages/admin/balance/RecordsTable";

import TotalsAnalytics from "../components/pages/admin/balance/TotalsAnalytics";

import "react-datepicker/dist/react-datepicker.css";
import Filters from "../components/pages/admin/balance/Filters";
import { useState } from "react";
import { ReportByDateResponse } from "@/api-hooks/report/get-reports-by-date";

const Balance = () => {
  const [totals, setTotals] = useState<ReportByDateResponse>();
  const [isPending, setIsPending] = useState<boolean>(false);

  return (
    <div>
      <Seo title="Balance List" />
      <Pageheader currentpage="Balance" withBreadCrumbs={false} />

      <Filters setIsPending={setIsPending} setTotalsReports={setTotals} />
      <TotalsAnalytics totals={totals} isPending={isPending} />
      <RevenueanalyticsProgress
        key={totals?.reports.map((report) => report.date).join(",")}
        reports={totals?.reports || []}
      />
      <RecordsTable />
    </div>
  );
};

Balance.layout = "Contentlayout";
export default Balance;
