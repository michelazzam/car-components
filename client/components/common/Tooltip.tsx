import React, { useState, useRef, useEffect } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "right",
}) => {
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tooltipRef.current || !containerRef.current) return;

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Check for right overflow if tooltip is on right
    if (
      position === "right" &&
      tooltipRect.right > viewportWidth &&
      tooltipRect.width < containerRect.left // only flip if there's space on left
    ) {
      setAdjustedPosition("left");
      return;
    }

    // Check for left overflow if tooltip is on left
    if (
      position === "left" &&
      tooltipRect.left < 0 &&
      tooltipRect.width < viewportWidth - containerRect.right // flip right if possible
    ) {
      setAdjustedPosition("right");
      return;
    }

    // For top and bottom, you can add similar logic if needed

    setAdjustedPosition(position); // default to original
  }, [position, content]);

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <div className="group relative inline-block" ref={containerRef}>
      {children}
      <div
        ref={tooltipRef}
        className={`
          absolute ${positionClasses[adjustedPosition]}
          px-3 py-1.5
          bg-gray-800 text-white text-sm rounded-lg
          inline-block max-w-[500px] min-w-max
          whitespace-normal break-words
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
