import Modal from "@/shared/Modal";
import React, { useRef, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { usePosStore } from "@/shared/store/usePosStore";
import { AddInvoiceSchema } from "@/lib/apiValidations";

const ChooseDraftInvoiceModal = ({
  triggerModalId,
  modalTitle,
}: {
  triggerModalId: string;
  modalTitle: string;
}) => {
  const {
    draftInvoices,
    deleteDraftInvoice,
    upsertDraftInvoice,
    clearPosStore,
  } = usePosStore();
  const { reset } = useFormContext<AddInvoiceSchema>();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // ensure one is pre-selected
  useEffect(() => {
    const current = draftInvoices.find((d) => d.isCurrent);
    setSelectedId(current?.draft_invoice_id || null);
  }, [draftInvoices]);

  const handleSwap = () => {
    if (!selectedId) return;
    const draft = draftInvoices.find((d) => d.draft_invoice_id === selectedId)!;
    // mark it current in store
    upsertDraftInvoice(draft);
    // load its values into the form
    reset(draft);
  };
  const handleDelete = (id: string, wasCurrent: boolean) => {
    deleteDraftInvoice(id);

    if (wasCurrent) {
      // if we just nuked the current draft, clear the form:
      reset({
        customerId: "",
        customer: {},
        vehicleId: "",
        vehicle: {},
        type: "s1",
        paymentMethods: [],
        discount: {
          amount: 0,
          type: "fixed",
        },
        hasVehicle: true,
        paidAmountUsd: 0,
        subTotalUsd: 0,
        totalUsd: 0,
        taxesUsd: 0,
        customerNote: "",
        items: [],
        swaps: [],
      });
      clearPosStore();
      setSelectedId(null);
    }
  };

  return (
    <Modal id={triggerModalId} size="lg">
      <Modal.Header title={modalTitle} id={triggerModalId} />

      <Modal.Body>
        {draftInvoices.length === 0 && (
          <p className="text-sm text-gray-500">No draft invoices saved yet.</p>
        )}

        {draftInvoices.map((d) => (
          <div
            key={d.draft_invoice_id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="choose-draft"
                value={d.draft_invoice_id}
                checked={d.draft_invoice_id === selectedId}
                onChange={() => setSelectedId(d.draft_invoice_id)}
                className="mr-2"
              />
              {/* show customerId or a timestamp */}
              <span className="font-medium">{d.customer?.label + " - "}</span>
              {d.draft_invoice_id && (
                <span className="text-xs text-gray-500">
                  {d.draft_invoice_id}
                </span>
              )}
              {d.isCurrent && (
                <span className="ml-2 text-green-600 text-xs">current</span>
              )}
            </label>
            <button
              type="button"
              onClick={() => handleDelete(d.draft_invoice_id, d.isCurrent)}
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
  );
};

export default ChooseDraftInvoiceModal;
