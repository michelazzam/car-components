import Link from "next/link";
import React from "react";

function TableCard() {
  return (
    <div className="xxl:col-span-3 xl:col-span-4 md:col-span-6 col-span-12">
      <div className="box custom-box">
        <div className="box-header items-center !justify-start flex-wrap !flex">
          <div className="me-2">
            <span className="avatar avatar-rounded p-1 bg-danger/10 text-danger">
              <img src="../../../../assets/images/company-logos/1.png" alt="" />
            </span>
          </div>
          <div className="flex-grow">
            <Link
              href="#!"
              className="font-semibold text-[.875rem] block text-truncate project-list-title"
            >
              Design &amp; Developing New Project
            </Link>
            <span className="text-[#8c9097] dark:text-white/50 block text-[0.75rem]">
              Total <strong className="text-defaulttextcolor">18/22</strong>{" "}
              tasks completed
            </span>
          </div>
          <div className="hs-dropdown ti-dropdown">
            <Link
              aria-label="anchor"
              href="#!"
              className="ti-btn ti-btn-sm ti-btn-light !mb-0"
              aria-expanded="false"
            >
              <i className="fe fe-more-vertical"></i>
            </Link>
            <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
              <li>
                <Link className="ti-dropdown-item" href="#!">
                  <i className="ri-eye-line align-middle me-1 inline-flex"></i>
                  View
                </Link>
              </li>
              <li>
                <Link className="ti-dropdown-item" href="#!">
                  <i className="ri-edit-line align-middle me-1 inline-flex"></i>
                  Edit
                </Link>
              </li>
              <li>
                <Link className="ti-dropdown-item" href="#!">
                  <i className="ri-delete-bin-line me-1 align-middle inline-flex"></i>
                  Delete
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="box-body">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold mb-1">Team :</div>
              <div className="avatar-list-stacked">
                <span className="avatar avatar-sm avatar-rounded">
                  <img src="../../../../assets/images/faces/2.jpg" alt="img" />
                </span>
                <span className="avatar avatar-sm avatar-rounded">
                  <img src="../../../../assets/images/faces/8.jpg" alt="img" />
                </span>
                <span className="avatar avatar-sm avatar-rounded">
                  <img src="../../../../assets/images/faces/2.jpg" alt="img" />
                </span>
                <span className="avatar avatar-sm avatar-rounded">
                  <img src="../../../../assets/images/faces/10.jpg" alt="img" />
                </span>
                <Link
                  className="avatar avatar-sm bg-primary avatar-rounded text-white"
                  href="#!"
                >
                  +2
                </Link>
              </div>
            </div>
            <div className="text-end">
              <div className="font-semibold mb-1">Priority :</div>
              <span className="badge bg-success/10 text-success">Low</span>
            </div>
          </div>
          <div className="font-semibold mb-1">Description :</div>
          <p className="text-[#8c9097] dark:text-white/50 mb-3">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi
            maiores similique tempore.
          </p>
          <div className="font-semibold mb-1">Status :</div>
          <div>
            <div></div>
            <div
              className="progress progress-xs progress-animate"
              role="progressbar"
              aria-valuenow={80}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="progress-bar bg-primary w-4/5"></div>
            </div>
            <div className="mt-1">
              <span className="text-primary font-semibold">80%</span> Completed
            </div>
          </div>
        </div>
        <div className="box-footer flex items-center justify-between">
          <div>
            <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">
              Assigned Date :
            </span>
            <span className="font-semibold block">24,May 2023</span>
          </div>
          <div className="text-end">
            <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">
              Due Date :
            </span>
            <span className="font-semibold block">12,Jul 2023</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableCard;
