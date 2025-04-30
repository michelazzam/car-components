import Modal from "@/shared/Modal";
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { Invoice } from "@/api-hooks/invoices/useListInvoices";
// import PrintStatement from "./PrintStatement";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

function PrintStatementModal({
  triggerModalId,
  title,
  printingInvoices = undefined,
  // startDate,
  // endDate,
  // currency,
  // customerDetails,
}: {
  triggerModalId: string;
  title: string;
  printingInvoices?: Invoice[];
  startDate: Date;
  endDate: Date;
  currency: "lbp" | "usd" | "usd_vat";
  customerDetails?: boolean;
}) {
  const cancelFormRef = useRef<HTMLButtonElement>(null);
  const invoiceRef = React.useRef<HTMLDivElement>(null);

  const handleDownloadPdf = () => {
    const input = invoiceRef.current;

    if (input && printingInvoices) {
      // Options for html2canvas to improve quality
      const canvasOptions = {
        scale: 3, // Increasing scale to boost resolution
        useCORS: true, // This helps with loading images from external URLs
      };

      html2canvas(input, canvasOptions).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        // Create a document in portrait orientation and A4 format
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Adjust the image dimensions to fit A4 page
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

        // Check if the image height is larger than page height
        let heightLeft = imgHeight;
        let position = 0;

        // Add image to PDF and manage page breaks if needed
        while (heightLeft >= 0) {
          pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
          heightLeft -= pageHeight;
          position -= pageHeight;

          // If there's content left, add a new page
          if (heightLeft > 0) {
            pdf.addPage();
          }
        }

        // Save the PDF with dynamic naming based on the content
        pdf.save(
          `${
            printingInvoices ? printingInvoices[0].customer.name : ""
          } statement.pdf`
        );
      });
    }
  };

  return (
    <Modal
      id={"print-statement-modal"}
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
        {printingInvoices && (
          <div>
            {/* <PrintStatement
              currency={currency}
              invoiceRef={invoiceRef}
              printingInvoices={printingInvoices}
              noTax={false}
              printA5={false}
              startDate={startDate}
              endDate={endDate}
              customerDetails={customerDetails}
            /> */}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <button
          ref={cancelFormRef}
          type="button"
          className="hs-dropdown-toggle ti-btn ti-btn-secondary"
          data-hs-overlay={`#${triggerModalId}`}
        >
          Close
        </button>

        {
          //@ts-ignore
          <ReactToPrint
            trigger={() => (
              <button className="ti-btn ti-btn-primary col-2">
                Print Statement
              </button>
            )}
            content={() => invoiceRef.current}
          />
        }
        <button
          className="ti-btn ti-btn-success col-2"
          onClick={handleDownloadPdf}
        >
          Download PDF
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default PrintStatementModal;
