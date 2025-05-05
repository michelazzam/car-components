import { useDeleteData } from "@/api-service/useDeleteData";
import Modal from "@/shared/Modal";
import { QueryKey } from "@tanstack/react-query";
import { useRef } from "react";
import { FaRegTrashCan } from "react-icons/fa6";

export default function DeleteRecord({
  endpoint,
  queryKeysToInvalidate,
}: {
  endpoint: string;
  queryKeysToInvalidate: QueryKey[];
}) {
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  const mutation = useDeleteData({
    endpoint,
    queryKeysToInvalidate,
    callBackOnSuccess: () => {
      cancelFormRef?.current?.click();
    },
  });

  const handleClose = () => {
    cancelFormRef?.current?.click();
  };

  return (
    <Modal id="delete-record-modal" size="xs">
      <Modal.Header title="Delete Record" id="delete-record-modal" />
      <Modal.Body>
        <div className="flex flex-col items-center justify-center">
          <FaRegTrashCan size={45} className="text-blue-500" />
          <strong className="mt-3 text-lg font-bold">
            Are you sure you want to delete this record?
          </strong>
          <p className="text-md mb-3 text-center">
            This action cannot be undone
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          ref={cancelFormRef}
          onClick={handleClose}
          type="button"
          data-hs-overlay={`#delete-record-modal`}
          className="hs-dropdown-toggle ti-btn ti-btn-secondary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => mutation.mutate()}
          className="ti-btn ti-btn-primary-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Deleting..." : "Delete"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
