// /shared/ConfirmModal.tsx
"use client";

import Modal from "@/shared/Modal";
import React, { useRef } from "react";

export interface ConfirmModalProps {
  /** The `id` that the HS Overlay will hook into */
  id: string;
  /** size of the modal (matches your Modal API) */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Title shown at top of modal. */
  title?: string;
  /** Main message/body. Can be a string or any JSX */
  description?: React.ReactNode;
  /** Text for the confirm button */
  confirmText?: string;
  /** Text for the cancel button */
  cancelText?: string;
  /** Icon or graphic to show above the title */
  icon?: React.ReactNode;
  /**
   * Called when user clicks "confirm".
   * After this runs, the modal will automatically close.
   */
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  id,
  size = "md",
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon,
  onConfirm,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = () => {
    onConfirm();
    // then close the modal
    cancelRef.current?.click();
  };

  return (
    <Modal id={id} size={size}>
      <Modal.Header title={title} id={id} />

      <Modal.Body>
        <div className="flex flex-col items-center justify-center">
          {icon && <div className="mb-2">{icon}</div>}
          <strong className="mt-2 text-lg font-bold text-center">
            {title}
          </strong>
          <p className="text-md mb-3 text-center">{description}</p>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          ref={cancelRef}
          type="button"
          data-hs-overlay={`#${id}`}
          className="ti-btn ti-btn-secondary"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="ti-btn ti-btn-primary-full"
        >
          {confirmText}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
