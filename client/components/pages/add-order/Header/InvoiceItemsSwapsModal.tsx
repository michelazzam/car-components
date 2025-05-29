import NumberFieldControlled from "@/components/admin/FormControlledFields/NumberFieldControlled";
import TextFieldControlled from "@/components/admin/FormControlledFields/TextFieldControlled";
import { AddInvoiceSchema } from "@/lib/apiValidations";
import Modal from "@/shared/Modal";
import { UseFieldArrayReturn, useFormContext } from "react-hook-form";
import { IoMdAdd } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { usePosStore } from "@/shared/store/usePosStore";
import { useEffect } from "react";

function InvoiceItemsSwapsModal({
  triggerModalId,
  modalTitle,

  swapsFieldArrayMethods,
}: {
  triggerModalId: string;
  modalTitle: string;
  swapsFieldArrayMethods: UseFieldArrayReturn<AddInvoiceSchema, "swaps">;
}) {
  // get the items swaps from the form
  const { control, watch } = useFormContext<AddInvoiceSchema>();
  const { setSwaps } = usePosStore();
  const { append, remove, fields } = swapsFieldArrayMethods;
  const swaps = watch("swaps") || [];

  useEffect(() => {
    setSwaps(swaps);
  }, [swaps]);

  return (
    <Modal id={triggerModalId} size="md" onClose={() => {}}>
      <Modal.Header title={modalTitle} id={triggerModalId} />
      <Modal.Body>
        <div>
          <div className="flex flex-wrap gap-x-4">
            {fields.map((itemSwap, index) => (
              <div key={itemSwap.id} className="w-full mb-4 border p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">
                    {itemSwap.itemName || `Item #${index + 1}`}
                  </h4>
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => remove(index)}
                    aria-label={`Remove swap item ${index + 1}`}
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <TextFieldControlled
                    label="Item Name"
                    name={`swaps.${index}.itemName`}
                    control={control}
                    colSpan={1}
                  />
                  <NumberFieldControlled
                    label="Quantity"
                    name={`swaps.${index}.quantity`}
                    control={control}
                    colSpan={1}
                  />
                  <NumberFieldControlled
                    label="Price"
                    name={`swaps.${index}.price`}
                    control={control}
                    colSpan={1}
                  />
                  <TextFieldControlled
                    dontCapitalize
                    label="Note"
                    colSpan={3}
                    name={`swaps.${index}.note`}
                    control={control}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              className="ti ti-btn ti-btn-primary flex items-center justify-center mt-2"
              onClick={() =>
                append({
                  itemName: "",
                  quantity: 1,
                  price: 0,
                  note: "",
                })
              }
            >
              <IoMdAdd className="mr-1" />
              Add Item to Swap
            </button>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          className="hs-dropdown-toggle ti-btn ti-btn-secondary"
          data-hs-overlay={`#${triggerModalId}`}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default InvoiceItemsSwapsModal;
