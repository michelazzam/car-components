import React from "react";

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
  pageSize = 10,
  totalAmount,
  setPageSize,
}: {
  currentPage: number;
  setCurrentPage: (current: number) => void;
  totalPages: number;
  pageSize?: number;
  totalAmount?: string;
  setPageSize?: (pageSize: number) => void;
}) => {
  const pageSizeOptions = [5, 10, 15, 20, 25, 50, 100];
  return (
    <div className="flex items-center justify-between gap-3 pr-2">
      <span className="font-bold">Number of Pages: {totalPages}</span>
      {totalAmount && (
        <span className=" text-success font-bold">
          Total Amount: {totalAmount}
        </span>
      )}
      <div className="flex items-center space-x-4">
        {setPageSize && (
          <div>
            <label htmlFor="pageSizeSelect" className="mr-2 font-bold">
              Items per page:
            </label>
            <select
              id="pageSizeSelect"
              className="border rounded-sm "
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center gap-3">
          <span
            className={`font-bold border rounded-sm px-2 py-1 ${
              currentPage == 1
                ? ""
                : "hover:cursor-pointer hover:text-white hover:bg-primary"
            }`}
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
          >
            Prev
          </span>
          <span className="w-[2rem] h-[2rem] flex items-center justify-center rounded-full border border-primary text-primary">
            <span>{currentPage}</span>
          </span>
          <span
            className={`font-bold border rounded-sm  px-2 py-1 ${
              currentPage == totalPages
                ? ""
                : "hover:cursor-pointer hover:text-white hover:bg-primary"
            }`}
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
              }
            }}
          >
            Next
          </span>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
