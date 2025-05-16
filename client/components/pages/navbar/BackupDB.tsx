import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";
import Modal from "@/shared/Modal";
import { useRef } from "react";
import { MdOutlineBackup } from "react-icons/md";

export default function BackupDBModal() {
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  const mutation = usePostData({
    endpoint: API.backupDB,
    callBackOnSuccess: () => {
      cancelFormRef?.current?.click();
    },
  });

  const handleClose = () => {
    cancelFormRef?.current?.click();
  };

  return (
    <Modal id="backup-db-modal" size="xs">
      <Modal.Header title="Backup Database" id="backup-db-modal" />
      <Modal.Body>
        <div className="flex flex-col items-center justify-center">
          <MdOutlineBackup size={45} className="text-blue-500" />
          <strong className="mt-3 text-lg font-bold">
            Are you sure you want to backup the database?
          </strong>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          ref={cancelFormRef}
          onClick={handleClose}
          type="button"
          data-hs-overlay={`#backup-db-modal`}
          className="hs-dropdown-toggle ti-btn ti-btn-secondary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => mutation.mutate({})}
          className="ti-btn ti-btn-primary-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Backing up..." : "Backup"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
