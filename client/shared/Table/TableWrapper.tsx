import Search from "@/components/admin/Search";
import React, { ReactNode } from "react";

function TableWrapper({
  children,
  title,
  id,
  searchValue,
  onSearchValueChange,
  withSearch = true,
}: {
  children: ReactNode;
  title?: string;
  id?: string;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  withSearch?: boolean;
}) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <div className="box">
          <div className="box-header flex-col !items-start space-y-2 ">
            {title && <h5 className="box-title ">{title}</h5>}
            {withSearch && (
              <div className="w-[20rem]">
                <Search
                  onChangeSearch={(v) => onSearchValueChange?.(v)}
                  value={searchValue}
                />
              </div>
            )}
          </div>
          <div className="box-body space-y-3">
            <div className="overflow-hidden table-bordered rounded-sm">
              <div
                id={id}
                className="ti-custom-table ti-striped-table ti-custom-table-hover"
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableWrapper;
