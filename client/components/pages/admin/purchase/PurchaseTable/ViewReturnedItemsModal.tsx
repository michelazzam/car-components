import { Purchase } from "@/api-hooks/purchase/use-list-purchase";
import { formatNumber } from "@/lib/helpers/formatNumber";
import Modal from "@/shared/Modal";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { MdPrint } from "react-icons/md";

interface ViewReturnedItemsModalProps {
  purchase?: Purchase | null;
  triggerModalId: string;
  modalTitle: string;
  setSelectedPurchase: (purchase: Purchase | undefined) => void;
}

const ViewReturnedItemsModal = ({
  purchase,
  triggerModalId,
  modalTitle,
  setSelectedPurchase,
}: ViewReturnedItemsModalProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const returnedItems =
    purchase?.items?.filter(
      (item) => item.returns && item.returns.length > 0
    ) || [];

  const returnedItemsFlattenedAccordingToDate = returnedItems.flatMap(
    (item) =>
      item.returns?.map((returnItem) => ({
        itemName: item.name,
        itemId: item.itemId,
        quantityReturned: returnItem.quantityReturned,
        returnedAt: returnItem.returnedAt,
        unitPrice: item.price,
        totalAmount: returnItem.quantityReturned * item.price,
      })) || []
  );

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <Modal
      id={triggerModalId}
      size="lg"
      onClose={() => setSelectedPurchase(undefined)}
    >
      <Modal.Header title={modalTitle} id={triggerModalId} />
      <Modal.Body>
        <div ref={printRef} className="p-4">
          <div className="flex justify-between items-start">
            <div className="grid grid-cols-12 gap-x-2 items-center mb-4">
              <div className="col-span-12">
                <h1 className="text-xl font-semibold">Returned Items</h1>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Invoice #{purchase?.invoiceNumber}</p>
                  <p>
                    Date:{" "}
                    {new Date(purchase?.invoiceDate || "").toLocaleDateString()}
                  </p>
                  <p>Supplier: {purchase?.supplier?.name}</p>
                  <p>Phone: {purchase?.supplier?.phoneNumber}</p>
                  <p>Address: {purchase?.supplier?.address}</p>
                </div>
              </div>
            </div>

            <img
              src={"/assets/images/brand-logos/logo.jpg"}
              alt="logo"
              className=" w-1/5 object-contain"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    Item Name
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-center">
                    Return Date
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-right">
                    Quantity Returned
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-right">
                    Unit Price
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-right">
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {returnedItemsFlattenedAccordingToDate.map((item, index) => (
                  <tr
                    key={`${item.itemId}-${item.returnedAt}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="border border-gray-200 px-4 py-2">
                      {item.itemName}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-center">
                      {new Date(item.returnedAt).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-right">
                      {item.quantityReturned}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-right">
                      ${formatNumber(item.unitPrice)}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-right">
                      ${formatNumber(item.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td
                    colSpan={4}
                    className="border border-gray-200 px-4 py-2 text-right font-semibold"
                  >
                    Total Returned Amount:
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-right font-semibold text-primary">
                    $
                    {formatNumber(
                      returnedItemsFlattenedAccordingToDate.reduce(
                        (sum, item) => sum + item.totalAmount,
                        0
                      )
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          onClick={handlePrint}
          className="btn btn-sm btn-primary text-primary border-primary border rounded-md p-1 hover:bg-primary hover:text-white transition-all"
        >
          <MdPrint className="text-xl" />
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewReturnedItemsModal;
