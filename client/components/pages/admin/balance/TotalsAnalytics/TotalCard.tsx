import { cn } from "@/utils/cn";
import React, { useEffect, useState } from "react";
import { IconType } from "react-icons/lib";

function TotalCard({
  title,
  value,
  Icon,
  isLoadingData,
  variant = "info",
}: {
  title: string;
  value: string;
  Icon: IconType;
  isLoadingData: boolean;
  variant?: "info" | "danger" | "success" | "warning";
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="lg:col-span-4  col-span-12">
      <div
        className={cn(
          "box overflow-hidden border",
          variant === "info" && "border-white",
          variant === "danger" && "border-danger",
          variant === "success" && "border-success",
          variant === "warning" && "border-warning"
        )}
      >
        <div className="box-body">
          <div className="flex items-top justify-between">
            <div>
              <span
                className={cn(
                  "!text-[0.8rem]  !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !rounded-full inline-flex items-center justify-center",
                  variant === "success" && "bg-success",
                  variant === "danger" && "bg-danger",
                  variant === "warning" && "bg-warning",
                  variant === "info" && "bg-info"
                )}
              >
                {isClient && <Icon className="ti text-[1rem] text-white" />}
              </span>
            </div>
            <div className="flex-grow ms-4">
              <div className="flex items-center justify-between flex-wrap">
                <div className="w-full">
                  <p className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-0">
                    {title}
                  </p>
                  {!isLoadingData ? (
                    <h4 className="font-semibold text-[1.5rem] !mb-2 ">
                      <span>{value}</span>
                    </h4>
                  ) : (
                    <div className="w-3/4 h-6 bg-gray-300 rounded-sm animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TotalCard;
