import SelectField, {
  SelectOption,
} from "@/components/admin/Fields/SlectField";
import Search from "@/components/admin/Search";
import React, { ReactNode } from "react";

function TableWrapper({
  children,
  title,
  id,
  searchValue,
  onSearchValueChange,
  withSearch = true,
  select,
}: {
  children: ReactNode;
  title?: string;
  id?: string;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  withSearch?: boolean;
  select?: {
    value: SelectOption | null;
    onChange: (value: SelectOption | null) => void;
    options: SelectOption[];
  };
}) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <div className="box">
          <div className="box-header flex-col !items-start space-y-2 ">
            {title && <h5 className="box-title ">{title}</h5>}
            <div className="flex gap-x-2 items-center justify-start">
              {withSearch && (
                <div className="w-[20rem]">
                  <Search
                    onChangeSearch={(v) => onSearchValueChange?.(v)}
                    value={searchValue}
                  />
                </div>
              )}
              {select && (
                <div className="w-[20rem]">
                  <SelectField
                    marginBottom="mb-1"
                    onChangeValue={(v) => {
                      select.onChange(v);
                    }}
                    value={select.value}
                    options={select.options}
                  />
                </div>
              )}
            </div>
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
