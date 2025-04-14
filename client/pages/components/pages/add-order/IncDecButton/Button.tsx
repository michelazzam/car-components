import { cn } from "@/utils/cn";
import React from "react";

function Button({
  onClick,
  size,
  type,
}: {
  onClick: () => void;
  size?: "sm" | "lg";
  type?: "dec" | "inc";
}) {
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          onClick();
        }}
        className={cn(
          " bg-primary rounded-md flex items-center justify-center ",
          size === "sm" && "size-6",
          size === "lg" && "size-8"
        )}
      >
        {type === "dec" ? (
          <i className="ri-subtract-line text-white"></i>
        ) : (
          <i className="ri-add-line text-white"></i>
        )}
      </button>
    </div>
  );
}

export default Button;
