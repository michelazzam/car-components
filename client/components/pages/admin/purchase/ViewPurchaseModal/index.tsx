import { Purchase } from "@/api-hooks/purchase/use-list-purchase";
import { useGetOrganization } from "@/api-hooks/restaurant/use-get-organization-info";
import Modal from "@/shared/Modal";
import React, { useRef } from "react";
import { FaPrint } from "react-icons/fa6";
import ReactToPrint from "react-to-print";

function ViewPurchaseModal({ purchase }: { purchase?: Purchase }) {
  const printRef = useRef<HTMLDivElement>(null);
  const { data: orgDetails } = useGetOrganization();
  if (!purchase) return null;

  // calculate sums
  const subtotal = purchase.items.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  const vatAmount = (subtotal * purchase.vatPercent) / 100;
  const grandTotal = subtotal + vatAmount;
  const balanceDue = grandTotal - purchase.amountPaid;

  return (
    <Modal id="view-purchase-modal">
      <Modal.Header id="view-purchase-modal" title="Invoice" />

      {/* remove default padding so we control it ourselves */}
      <Modal.Body paddingX="!px-0">
        <div ref={printRef} className="bg-white p-8">
          {/* ===== HEADER ===== */}

          <div className="flex justify-between items-center mb-8">
            <div>
              <img
                src={"/assets/images/brand-logos/logo.jpg"}
                alt="logo"
                className="w-32"
              />
            </div>

            <div className="text-right space-y-1">
              <h1 className="text-3xl font-bold">Invoice</h1>

              <div>
                <span className="font-semibold">Invoice #:</span>{" "}
                {purchase.invoiceNumber}
              </div>
              <div>
                <span className="font-semibold">Date:</span>{" "}
                {purchase.invoiceDate}
              </div>
            </div>
          </div>

          {/* ===== DETAILS ===== */}
          <div className="grid grid-cols-2 gap-12 mb-8">
            {/* Supplier */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Supplier</h2>
              <div>{purchase.supplier.name}</div>
              <div>{purchase.supplier.phoneNumber}</div>
            </div>
            {/* Company */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Company</h2>
              <div>{orgDetails?.name || "N/A"}</div>
              <div>{orgDetails?.phoneNumber || "N/A"}</div>
            </div>
          </div>

          {/* ===== ITEMS TABLE ===== */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Product</th>
                  <th className="px-4 py-2 border">Unit Price</th>
                  <th className="px-4 py-2 border">Qty</th>
                  <th className="px-4 py-2 border">Free</th>
                  <th className="px-4 py-2 border">Discount</th>
                  <th className="px-4 py-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {purchase.items.map((item, i) => (
                  <tr key={i} className={i % 2 ? "bg-gray-50" : ""}>
                    <td className="px-4 py-2 border">{item.name}</td>
                    <td className="px-4 py-2 border">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border">{item.quantity}</td>
                    <td className="px-4 py-2 border">{item.quantityFree}</td>
                    <td className="px-4 py-2 border">
                      ${item.discount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border">
                      ${item.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== TOTALS ===== */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-1">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>VAT ({purchase.vatPercent}%):</span>
                <span>${vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t font-semibold">
                <span>Total:</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* ===== PAYMENT ===== */}
          <div className="mt-4 flex justify-end">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-1">
                <span>Amount Paid:</span>
                <span>${purchase.amountPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t font-semibold">
                <span>Balance Due:</span>
                <span>${balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <ReactToPrint
          trigger={() => (
            <button className="ti-btn ti-btn-primary-full ti-btn-wave rounded-md">
              <FaPrint />
            </button>
          )}
          content={() => printRef.current}
        />
      </Modal.Footer>
    </Modal>
  );
}

export default ViewPurchaseModal;
