import React from "react";
import RevenueAnalytics from "./RevenueAnalytics";
import { Report } from "@/api-hooks/report/get-reports-by-date";

function RevenueanalyticsProgress({ reports }: { reports: Report[] }) {
  return (
    <div>
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        <div className="box">
          <div className="box-header !gap-0 !m-0 justify-between">
            <div className="box-title">Revenue Analytics</div>
            {/* <div className="hs-dropdown ti-dropdown">
              <Link
                href="#!"
                className="text-[0.75rem] px-2 font-normal text-[#8c9097] dark:text-white/50"
                aria-expanded="false"
              >
                View All
                <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
              </Link>
              <ul
                className="hs-dropdown-menu ti-dropdown-menu hidden"
                role="menu"
              >
                <li>
                  <Link
                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                    href="#!"
                  >
                    Today
                  </Link>
                </li>
                <li>
                  <Link
                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                    href="#!"
                  >
                    This Week
                  </Link>
                </li>
                <li>
                  <Link
                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                    href="#!"
                  >
                    Last Week
                  </Link>
                </li>
              </ul>
            </div> */}
          </div>
          <div className="box-body !py-5">
            <div id="crm-revenue-analytics">
              <RevenueAnalytics reports={reports} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RevenueanalyticsProgress;
