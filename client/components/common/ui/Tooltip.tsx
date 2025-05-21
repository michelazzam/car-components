import React from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "right",
}: TooltipProps) => {
  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };
  return (
    <div className="group relative inline-block">
      {children}
      <div
        className={`
        absolute ${positionClasses[position]}
        px-3 py-1.5
        bg-gray-800 text-white text-sm rounded-lg
        w-[1000px] max-w-[50vw] text-wrap
        whitespace-nowrap
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        z-50 pointer-events-none
        shadow-lg
      `}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
