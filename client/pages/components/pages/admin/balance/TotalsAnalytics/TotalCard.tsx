import React, { useEffect, useState } from "react";
import { IconType } from "react-icons/lib";

function TotalCard({
  title,
  value,
  Icon,
  isLoadingData,
}: {
  title: string;
  value: string;
  Icon: IconType;
  isLoadingData: boolean;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="lg:col-span-4  col-span-12">
      <div className="box overflow-hidden">
        <div className="box-body">
          <div className="flex items-top justify-between">
            <div>
              <span className="!text-[0.8rem]  !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !rounded-full inline-flex items-center justify-center bg-secondary">
                {isClient && <Icon className="ti text-[1rem] text-white" />}
              </span>
            </div>
            <div className="flex-grow ms-4">
              <div className="flex items-center justify-between flex-wrap">
                <div>
                  <p className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-0">
                    {title}
                  </p>
                  {!isLoadingData ? (
                    <h4 className="font-semibold text-[1.5rem] !mb-2 ">
                      <span>{value}</span>
                    </h4>
                  ) : (
                    <div className="w-8 h-4 bg-gray-300 rounded-md animate-pulse"></div>
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
