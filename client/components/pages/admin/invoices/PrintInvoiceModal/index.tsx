import Modal from "@/shared/Modal";
import React, { useRef, useState } from "react";
import PrintInvoice from "./PrintInvoice";
import ReactToPrint from "react-to-print";
import { Invoice } from "@/api-hooks/invoices/useListInvoices";
import Checkbox from "@/components/admin/Fields/Checkbox";

function PrintInvoiceModal({
  triggerModalId,
  title,
  printingInvoices = undefined,
  previewingInvoice = undefined,
  prev = false,
}: {
  triggerModalId: string;
  title: string;
  printingInvoices?: Invoice[] | undefined;
  previewingInvoice?: Invoice;
  prev?: boolean;
}) {
  const [noTax, setNoTax] = useState(true);
  const [loading, setLoading] = useState(false);

  const cancelFormRef = useRef<HTMLButtonElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const downloadPdfDocument = async () => {
    if (!parentRef.current) return;
    setLoading(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const opt = {
        margin: 0,
        filename:
          printingInvoices && printingInvoices.length === 1
            ? `${printingInvoices[0].customer.name}-${printingInvoices[0].number}.pdf`
            : "invoices.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      };

      const worker = html2pdf();
      await worker.set(opt).from(parentRef.current).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal id={triggerModalId} size="md" onClose={() => {}}>
      <Modal.Header title={title} id={triggerModalId} />

      <Modal.Body>
        <div ref={parentRef} className="bg-white  ">
          {!prev &&
            printingInvoices &&
            printingInvoices.length > 0 &&
            printingInvoices.map((invoice, index) => (
              <div
                key={index}
                className={
                  printingInvoices.length > 1 ? "invoice-page-break p-4" : "p-4"
                }
              >
                <PrintInvoice
                  printingInvoice={invoice}
                  previewingInvoice={undefined}
                  noTax={noTax || invoice.type === "s2"}
                  prev={prev}
                  printA5={false}
                />
              </div>
            ))}
        </div>
        <div>
          {prev && (
            <PrintInvoice
              printingInvoice={undefined}
              previewingInvoice={previewingInvoice}
              noTax={noTax || previewingInvoice?.type === "s2"}
              prev={prev}
              printA5={false}
            />
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Checkbox
          label="No VAT"
          isChecked={noTax}
          onValueChange={() => setNoTax(!noTax)}
        />
        <button
          ref={cancelFormRef}
          type="button"
          className="hs-dropdown-toggle ti-btn ti-btn-secondary"
          data-hs-overlay={`#${triggerModalId}`}
        >
          Close
        </button>

        {!previewingInvoice && (
          //@ts-ignore
          <ReactToPrint
            trigger={() => (
              <button className="ti-btn ti-btn-primary col-2">
                Print Invoice
              </button>
            )}
            content={() => parentRef.current}
          />
        )}
        {!previewingInvoice && (
          <button
            id="download-btn"
            onClick={downloadPdfDocument}
            // data-hs-overlay="#print-invoice-modal"
            className="ti-btn ti-btn-success col-2"
          >
            {loading ? "Downloading" : "Download"}
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default PrintInvoiceModal;
