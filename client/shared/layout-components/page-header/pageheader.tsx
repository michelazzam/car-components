import React, { Fragment } from "react";

const Pageheader = ({
  currentpage,
  activepage,
  mainpage,
  triggerModalId,
  buttonTitle,
  withBreadCrumbs = true,
}: {
  currentpage?: string;
  activepage?: string;
  mainpage?: string;
  triggerModalId?: string;
  buttonTitle?: string;
  withBreadCrumbs?: boolean;
}) => {
  return (
    <Fragment>
      <div className="block justify-between page-header md:flex">
        <div>
          <h3 className="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white dark:hover:text-white text-[1.125rem] font-semibold">
            {currentpage}
          </h3>
        </div>
        <div className="flex items-center gap-x-2 ">
          {withBreadCrumbs && (
            <ol className="flex items-center whitespace-nowrap min-w-0">
              <li className="text-[0.813rem] ps-[0.5rem]">
                <a
                  className="flex items-center text-primary hover:text-primary dark:text-primary truncate"
                  href="#!"
                >
                  {activepage}
                  <i className="ti ti-chevrons-right flex-shrink-0 text-[#8c9097] dark:text-white/50 px-[0.5rem] overflow-visible rtl:rotate-180"></i>
                </a>
              </li>
              <li
                className="text-[0.813rem] text-defaulttextcolor font-semibold hover:text-primary dark:text-[#8c9097] dark:text-white/50 "
                aria-current="page"
              >
                {mainpage}
              </li>
            </ol>
          )}
          {triggerModalId && (
            <button
              type="button"
              data-hs-overlay={`#${triggerModalId}`}
              className={`ti-btn ti-btn-primary-full ti-btn-wave`}
              key={Math.random()}
            >
              {buttonTitle}
            </button>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Pageheader;
