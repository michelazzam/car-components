import Modal from "@/shared/Modal";
import React, { useRef, useState } from "react";
import ConfirmModal from "@/components/admin/FalseTruePopup";
import { FaRegTrashCan } from "react-icons/fa6";
import {
  DraftPurchase,
  usePurchaseFormStore,
} from "@/shared/store/usePurchaseStore";

const ChooseDraftPurchases = ({
  triggerModalId,
  modalTitle,
}: {
  triggerModalId: string;
  modalTitle: string;
}) => {
  const {
    draftPurchases,
    deleteDraftPurchase,
    currentDraftId,
    populateDraftPurchase,
    reset,
  } = usePurchaseFormStore();
  const [selectedId, setSelectedId] = useState<string | null>(currentDraftId);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // ensure one is pre-selected

  const handleSwap = () => {
    if (!selectedId) return;
    populateDraftPurchase(selectedId);
  };
  const [selectedDraft, setSelectedDraft] = useState<
    DraftPurchase | undefined
  >();
  const handleDelete = (id: string, wasCurrent: boolean) => {
    deleteDraftPurchase(id);
    if (wasCurrent) {
      // if we just nuked the current draft, clear the form:
      reset();
      setSelectedId(null);
    }
  };

  return (
    <div>
      <Modal id={triggerModalId} size="lg">
        <Modal.Header title={modalTitle} id={triggerModalId} />

        <Modal.Body>
          {draftPurchases.length === 0 && (
            <p className="text-sm text-gray-500">
              No draft purchases saved yet.
            </p>
          )}

          {draftPurchases.map((d) => (
            <div
              key={d.draft_purchase_id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="choose-draft"
                  value={d.draft_purchase_id}
                  checked={d.draft_purchase_id === selectedId}
                  onChange={() => setSelectedId(d.draft_purchase_id)}
                  className="mr-2"
                />
                {/* show customerId or a timestamp */}
                {d.supplier && d.supplier.label && (
                  <span className="font-medium">
                    {d?.supplier?.label + " - "}
                  </span>
                )}
                {d.invoiceNumber && (
                  <span className="text-xs text-gray-500">
                    #{d.invoiceNumber} -
                  </span>
                )}
                {d.draft_purchase_id && (
                  <span className="text-xs text-gray-500">
                    {d.draft_purchase_id}
                  </span>
                )}
                {d.draft_purchase_id === currentDraftId && (
                  <span className="ml-2 text-green-600 text-xs">current</span>
                )}
              </label>
              <button
                onClick={() => setSelectedDraft(d)}
                type="button"
                data-hs-overlay="#delete-record-modal"
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <button
            ref={cancelRef}
            type="button"
            className="ti-btn ti-btn-secondary-full"
            data-hs-overlay={`#${triggerModalId}`}
          >
            Close
          </button>
          <button
            type="button"
            disabled={!selectedId}
            className="ti-btn ti-btn-primary-full"
            data-hs-overlay={`#${triggerModalId}`}
            onClick={handleSwap}
          >
            Load Draft
          </button>
        </Modal.Footer>
      </Modal>
      <ConfirmModal
        id="delete-record-modal"
        size="xs"
        title="Delete Record"
        description="This action cannot be undone"
        confirmText="Delete"
        cancelText="Cancel"
        icon={<FaRegTrashCan size={45} className="text-blue-500" />}
        onConfirm={() => {
          // handleDelete(d.draft_purchase_id, d.isCurrent);
          if (selectedDraft) {
            handleDelete(
              selectedDraft?.draft_purchase_id,
              selectedDraft?.isCurrent
            );
          }
        }}
      />
    </div>
  );
};

export default ChooseDraftPurchases;
