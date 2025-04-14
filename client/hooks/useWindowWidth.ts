import { useState, useEffect } from "react";

// Custom hook to get the current window width
const useWindowSize = () => {
  // Initialize width with undefined to handle server-side rendering
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      // Set width to window's current width
      setWidth(window.innerWidth);
    };

    // Ensure window object is defined before using it
    if (typeof window !== "undefined") {
      // Add event listener
      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();
    }
    // Remove event listener on cleanup
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []); // Empty array ensures that effect runs only on mount and unmount

  return width;
};

export default useWindowSize;
