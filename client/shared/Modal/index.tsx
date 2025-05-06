import useWindowSize from "@/hooks/useWindowWidth";
import React, { ReactNode, useEffect, useRef, useState } from "react";

const sizeMap = {
  xs: "30%",
  sm: "40%",
  md: "50%",
  lg: "60%",
  xl: "70%",
  xxl: "90%",
};

const mediumScreenSizeMap = {
  xs: "60%",
  sm: "65%",
  md: "70%",
  lg: "78%",
  xl: "85%",
  xxl: "95%",
};
const smallScreenSizeMap = {
  xs: "65%",
  sm: "70%",
  md: "75%",
  lg: "80%",
  xl: "85%",
  xxl: "97%",
};

// Base Modal component
const Modal = ({
  children,
  id,
  size = "sm",
  props,
  onClose = () => {},
  onOpen = () => {},
}: {
  children: ReactNode;
  id: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  props?: any;
  onClose?: () => void;
  onOpen?: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const windowSize = useWindowSize();

  const isSmallScreen = windowSize && windowSize < 768;
  const isMediumScreen = windowSize && windowSize >= 768 && windowSize < 1024;

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    const modalElement = modalRef.current;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const target = mutation.target as HTMLElement;
          if (target.classList.contains("open")) {
            onOpen();
          } else if (target.classList.contains("hidden")) {
            onClose();
          }
        }
      });
    });

    if (modalElement) {
      observer.observe(modalElement, {
        attributes: true, // observe attribute changes
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [onClose, onOpen]);

  // Only render the modal once styles are loaded
  if (!isReady) return null;

  return (
    <div
      onClick={(e) => {
        if (isMouseDown) {
          setIsMouseDown(false);
          e.stopPropagation();
        }
      }}
      ref={modalRef}
      className={`hs-overlay hidden ti-modal w-screen !overflow-y-hidden `}
      id={id}
      key={id + "-key"}
      {...props}
    >
      <div
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
        style={{
          maxWidth: `${
            isSmallScreen
              ? smallScreenSizeMap[size]
              : isMediumScreen
              ? mediumScreenSizeMap[size]
              : sizeMap[size]
          }`,
        }}
        className="!mt-[calc(50vh)] -translate-y-[calc(50%-30px)]  hs-overlay-open:-translate-y-1/2  ti-modal-box ease-out "
      >
        <div className="ti-modal-content w-full">{children}</div>
      </div>
    </div>
  );
};

// Modal Header
const ModalHeader = ({ title, id }: { title: string; id: string }) => {
  return (
    <div className="ti-modal-header">
      <h6 className="modal-title" id="staticBackdropLabel2">
        {title}
      </h6>
      {/* close */}
      <button
        type="button"
        className="hs-dropdown-toggle ti-modal-close-btn"
        data-hs-overlay={`#${id}`}
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3.5 h-3.5"
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
};

// Modal Body
const ModalBody = ({
  children,
  maxHeight = "80vh",
  paddingX = "px-4",
  paddingY = "py-4",
}: {
  children: ReactNode;
  maxHeight?: string;
  paddingX?: string;
  paddingY?: string;
}) => {
  return (
    <div
      style={{
        maxHeight: maxHeight,
      }}
      className={`ti-modal-body overflow-y-scroll custom-scrollbar-container ${paddingX} ${paddingY}`}
    >
      {children}
    </div>
  );
};

// Modal Footer
const ModalFooter = ({ children }: { children: ReactNode }) => {
  return <div className="ti-modal-footer">{children}</div>;
};

// Assign Header and Body as static properties of Modal
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
