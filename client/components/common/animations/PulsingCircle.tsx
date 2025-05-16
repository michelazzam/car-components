import { cn } from "@/utils/cn";
import React from "react";

function PulsingCircle({
  size = "size-3",
  containerClassName = "",
}: {
  size?: string;
  containerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-full bg-secondary ",
        size,
        containerClassName
      )}
    >
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ",
          size
        )}
      >
        <div className=" rounded-full  size-full bg-secondary animate-ping" />
      </div>
    </div>
  );
}

export default PulsingCircle;
