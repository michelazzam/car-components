import Modal from "@/shared/Modal";
import React, { useRef } from "react";
import { basePath } from "@/next.config";
// import ReactToPrint from "react-to-print";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Billing } from "@/pages/admin/ams/billing";
import ReactToPrint from "react-to-print";

function PrintBillingInvoiceModal({
  triggerModalId,
  invoice,
  isReceipt,
}: {
  triggerModalId: string;
  invoice: Billing;
  isReceipt: boolean;
}) {
  //---------------------------REFS------------------------------
  const closeModalRef = useRef<HTMLButtonElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  console.log(invoice);

  //--------Functions-------------\
  const subTotalAmount = invoice.details.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = (subTotalAmount * invoice.organization.tax) / 100;
  // Function to generate and download the PDF
  const handleDownloadPDF = async () => {
    if (!parentRef.current) return;

    const element = parentRef.current;
    const canvas = await html2canvas(element, {
      scale: 2, // Ensures high quality
      backgroundColor: "#ffffff", // Prevents transparency issues
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight); // Set X, Y to 0,0
    pdf.save(`Invoice_${invoice.number}.pdf`);
  };

  return (
    <Modal id={triggerModalId} size="lg">
      <Modal.Header title="Print Invoice" id={triggerModalId} />
      <Modal.Body paddingX="!px-0" paddingY="!py-0">
        <div ref={parentRef}>
          <img
            src={`${
              process.env.NODE_ENV === "production" ? basePath : ""
            }/assets/images/ams/decoration.png`}
            alt="logo"
            className="desktop-logo w-full h-28"
          />
          <div className="max-w-4xl mx-auto bg-white p-4">
            {/* Header */}
            <div className="flex justify-between items-center pb-6">
              <div className="flex items-center">
                <img
                  src={`${
                    process.env.NODE_ENV === "production" ? basePath : ""
                  }/assets/images/ams/ams-logo1.jpg`}
                  alt="logo"
                  className="desktop-logo w-28 h-28"
                />
                <img
                  src={`${
                    process.env.NODE_ENV === "production" ? basePath : ""
                  }/assets/images/ams/ams-logo2.jpg`}
                  alt="logo"
                  className="desktop-logo w-48 h-auto"
                />
              </div>
              <h1 className="text-4xl font-bold text-amsBlue2">
                {isReceipt ? "RECEIPT" : "INVOICE"}
              </h1>
            </div>
            <div className="flex justify-between items-center pb-6">
              <div>
                <h2 className="text-md text-blue-800">CONTACT PERSON:</h2>
                <p className="text-amsBlue2 font-semibold">
                  MR. {invoice.organization.contactName}
                </p>
              </div>
              <div className="w-1/3">
                {isReceipt ? (
                  <p className="text-gray-700 flex justify-between">
                    <span className="font-semibold">Paid At:</span>
                    <span>{invoice?.paidAt?.slice(0, 10)}</span>
                  </p>
                ) : (
                  <p className="text-gray-700 flex justify-between">
                    <span className="font-semibold">Invoice Date:</span>
                    <span>{invoice.createdAt.slice(0, 10)}</span>
                  </p>
                )}
                <p className="text-gray-700 flex justify-between">
                  <span className="font-semibold">Invoice No:</span>
                  <span>{invoice.number}</span>
                </p>
                {/* <p className="text-gray-700 flex justify-between">
                  <span className="font-semibold">MOF No:</span>
                  <span>xxx</span>
                </p> */}
              </div>
            </div>

            {/* Invoice Details */}
            <div className="flex justify-between items-center pb-6">
              <div>
                <p className="text-gray-600 text-sm">
                  {invoice.organization.phone}
                </p>
                <p className="text-gray-600 text-sm">
                  {invoice.organization.email}
                </p>
                <p className="text-gray-600 text-sm">
                  {invoice.organization.address}
                </p>
              </div>
              {invoice.bankAccount?.accountNumber ? (
                <div className="w-1/3">
                  <p className="text-gray-700 font-semibold text-end">
                    PAYMENT METHOD
                  </p>

                  <p className="text-gray-700 flex justify-between">
                    <span className="font-semibold">Account No:</span>
                    <span>{invoice.bankAccount?.accountNumber}</span>
                  </p>

                  <p className="text-gray-700 flex justify-between">
                    <span className="font-semibold">Iban: </span>
                    <span>{invoice.bankAccount.iban}</span>
                  </p>
                  <p className="text-gray-700 flex justify-between">
                    <span className="font-semibold">Currency: </span>
                    <span>{invoice.bankAccount?.currencyCode}</span>
                  </p>
                  <p className="text-gray-700 flex justify-between">
                    <span className="font-semibold">Swift Code: </span>
                    <span>{invoice.bankAccount?.swiftCode}</span>
                  </p>
                  {isReceipt && invoice.paymentLink && (
                    <p className="text-gray-700 flex justify-between">
                      <span className="font-semibold">PaymentLink: </span>
                      <span>{invoice.paymentLink}</span>
                    </p>
                  )}
                </div>
              ) : (
                <div className="w-1/3" />
              )}
            </div>

            {/* Invoice To */}
            <div className="mt-6">
              <p className="text-gray-700 font-semibold">
                {isReceipt ? "RECEIPT" : "INVOICE"} TO:
              </p>
              <p className="text-amsBlue2 font-bold">
                MR. {invoice.client.contactName}
              </p>
            </div>

            {/* Invoice Table */}
            {/* <div className="mt-6 rounded-t-md rounded-b-sm border-b border-gray-700 overflow-hidden">
              <table className="w-full border-collapse border rounded-t-md">
                <thead className="bg-gradient-to-r from-amsBlue1 to-amsBlue2 ">
                  <tr className=" text-white rounded-t-md">
                    <th className="py-2 px-4">Description</th>
                    <th className="py-2 px-4">Price</th>
                    <th className="py-2 px-4">Quantity</th>
                    <th className="py-2 px-4">Amount</th>
                  </tr>
                </thead>
                <tbody className="border border-gray-700">
                  {invoice.details.map((item) => {
                    return (
                      <tr className="border-b">
                        <td className="py-3 px-4 text-center border-r border-gray-700 ">
                          {item.description}
                        </td>
                        <td className="py-3 px-4 text-center border-r border-gray-700">
                          ${item.price}
                        </td>
                        <td className="py-3 px-4 text-center border-r border-gray-700">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-4 text-center">
                          ${item.price * item.quantity}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div> */}
            <div className="mt-6 overflow-hidden rounded-t-md border border-gray-700">
              <table className="w-full border-separate border-spacing-0">
                <thead className="bg-gradient-to-r from-amsBlue1 to-amsBlue2 text-white rounded-t-md">
                  <tr>
                    <th className="py-3 px-4 border border-gray-700">
                      Description
                    </th>
                    <th className="py-3 px-4 border border-gray-700">Price</th>
                    <th className="py-3 px-4 border border-gray-700">
                      Quantity
                    </th>
                    <th className="py-3 px-4 border border-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.details.map((item, index) => (
                    <tr key={index} className="border border-gray-700">
                      <td className="py-3 px-4 text-center border border-gray-700">
                        {item.description}
                      </td>
                      <td className="py-3 px-4 text-center border border-gray-700">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center border border-gray-700">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-center border border-gray-700">
                        $
                        {(
                          item.price * item.quantity +
                          item.price *
                            item.quantity *
                            (invoice.organization.tax * 0.01)
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notes & Summary */}
            <div className="mt-6 flex justify-between items-start">
              {/* Notes Section */}
              {invoice.notes ? (
                <div className="w-1/2 bg-gray-100 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700">Notes:</p>
                  <p className="text-red-500">{invoice.notes}</p>
                </div>
              ) : (
                <div className="w-1/2" />
              )}

              {/* Summary Section */}
              <div className="w-1/3">
                <p className="text-gray-700">
                  <span className="font-semibold">Sub Total:</span> ${" "}
                  {subTotalAmount.toFixed(2)}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">{`Tax(${invoice.organization.tax}%):`}</span>{" "}
                  LBP {(tax * invoice.usdRate).toFixed(2)}
                </p>
                {invoice.discount && invoice.discount !== 0 ? (
                  <p className="text-danger">
                    <span className="font-semibold">Discount:</span> ${" "}
                    {invoice.discount}
                  </p>
                ) : (
                  ""
                )}
                <p className="text-xl font-bold bg-gradient-to-r from-amsBlue1 to-amsBlue2 text-white text-center py-2 mt-3 rounded-lg flex items-center justify-between px-2">
                  <span>Total:</span>
                  <span>
                    $ {(subTotalAmount + tax - invoice.discount).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="w-full h-16 bg-gradient-to-r from-amsBlue1 to-amsBlue2 mt-16"></div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          ref={closeModalRef}
          type="button"
          className="hs-dropdown-toggle ti-btn ti-btn-secondary"
          data-hs-overlay={`#${triggerModalId}`}
        >
          Cancel
        </button>
        <ReactToPrint
          trigger={() => (
            <button className="ti-btn ti-btn-primary col-2">
              Print Invoice
            </button>
          )}
          content={() => parentRef.current}
        />
        {/* <button
          type="submit"
          onClick={() => {
            formRef.current?.requestSubmit();
          }}
          className="ti-btn ti-btn-primary-full"
        >
          {false ? "Printing" : "Print"}
        </button> */}
        <button
          onClick={handleDownloadPDF}
          className="ti-btn ti-btn-primary-full"
        >
          Download PDF
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default PrintBillingInvoiceModal;
