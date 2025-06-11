import { LoanTransaction } from "@/api-hooks/money-transactions/use-list-loans-transactions";
import Modal from "@/shared/Modal";
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import PrintReceipt from "./PrintReceipt";

function PrintReceiptModal({
  selectedTransaction,
  setSelectedTransaction,
  triggerModalId,
  title,
}: {
  selectedTransaction: LoanTransaction | null;
  setSelectedTransaction: React.Dispatch<
    React.SetStateAction<LoanTransaction | null>
  >;
  triggerModalId: string;
  title: string;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <Modal
      size="md"
      id={triggerModalId}
      onClose={() => setSelectedTransaction(null)}
    >
      <Modal.Header title={title} id={triggerModalId} />
      <Modal.Body>
        <div ref={parentRef}>
          {selectedTransaction && (
            <PrintReceipt transaction={selectedTransaction} />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <ReactToPrint
          trigger={() => (
            <button className="ti-btn ti-btn-primary col-2">
              Print Receipt
            </button>
          )}
          content={() => parentRef.current}
        />
      </Modal.Footer>
    </Modal>
  );
}

export default PrintReceiptModal;
