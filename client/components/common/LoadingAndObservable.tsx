import React, { forwardRef } from "react";

const LoadingAndObservable = forwardRef<
  HTMLDivElement,
  {
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    noMoreText?: string;
  }
>(({ isFetchingNextPage, hasNextPage, noMoreText = "No more orders" }, ref) => {
  return (
    <div className="w-full flex items-center justify-center my-10">
      <div ref={ref} className="h-1">
        {hasNextPage
          ? isFetchingNextPage
            ? "Loading more..."
            : "Scroll to load more"
          : noMoreText}
      </div>
    </div>
  );
});
LoadingAndObservable.displayName = "LoadingAndObservable";
export default LoadingAndObservable;
