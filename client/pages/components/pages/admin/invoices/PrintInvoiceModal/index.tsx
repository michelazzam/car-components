import Modal from "@/shared/Modal";
import React, { useRef, useState } from "react";
import PrintInvoice from "./PrintInvoice";
import ReactToPrint from "react-to-print";
import { Invoice } from "@/api-hooks/invoices/useListInvoices";
import Checkbox from "@/pages/components/admin/ControlledFields/Checkbox";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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
  previewingInvoice?: PreviewInvoice;
  prev?: boolean;
}) {
  const [noTaxt, setNoTax] = useState(true);
  const [loading, setLoading] = useState(false);

  const cancelFormRef = useRef<HTMLButtonElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const downloadPdfDocument = async () => {
    setLoading(true);
    const container = parentRef.current;

    if (container && printingInvoices && printingInvoices.length > 0) {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const options = {
        scale: 1, // Increasing scale to boost resolution
        useCORS: true, // This helps with loading images from external URLs
        width: container.offsetWidth, // Ensure the canvas has the correct width
      };

      // Process each invoice separately
      for (let i = 0; i < printingInvoices.length; i++) {
        const invoiceElement = container.children[i]; // Assuming each child corresponds to an invoice

        if (!invoiceElement) continue; // Skip if no element is found

        const canvas = await html2canvas(
          invoiceElement as HTMLElement,
          options
        );
        const imgData = canvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        // Add a new page for the next invoice unless it's the last one
        if (i < printingInvoices.length - 1) {
          pdf.addPage();
        }
      }

      // Save the PDF with dynamic naming based on the content
      pdf.save(
        printingInvoices.length > 1
          ? "invoices.pdf"
          : `${printingInvoices[0].customer.name}-TB${printingInvoices[0].invoiceNumber}.pdf`
      );
    }
    setLoading(false);
  };

  return (
    <Modal
      id={triggerModalId}
      size="md"
      onClose={() => {
        console.log("close");
      }}
      onOpen={() => {
        console.log("open");
      }}
    >
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
                  noTax={noTaxt}
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
              noTax={noTaxt}
              prev={prev}
              printA5={false}
            />
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Checkbox
          label="No VAT"
          isChecked={!noTaxt}
          onValueChange={() => setNoTax(!noTaxt)}
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

export type PreviewInvoice = {
  driverName?: string;
  generalNote?: string;
  customerNote?: string;
  invoiceNumber?: number;

  discount: {
    amount: number;
    type: "fixed" | "percentage";
  };

  customer?: CustomerPrev;

  vehicle?: VehiclePrev;
  usdRate?: number;
  products?: InvoicePreviewItem[];
  services?: InvoicePreviewItem[];
  totalPriceLbp: number;
  totalPriceUsd: number;
  amountPaidUsd: number;
  amountPaidLbp: number;
  taxesLbp: number;
};
export type CustomerPrev = {
  name: string;
  phone?: string;
  address?: string;
  tvaNumber?: string;
};
export type VehiclePrev = {
  vehicleNb?: string;
  model?: string;
};
export interface InvoicePreviewItem {
  type?: string;
  name?: string;
  quantity?: number;
  price?: number;
  amount?: number;
}
