import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, CustomerSchema } from "@/lib/apiValidations";
import TextField from "@/pages/components/admin/FormFields/TextField";
import { Customer } from "@/api-hooks/customer/use-list-customer";
import { useAddCustomer } from "@/api-hooks/customer/use-add-customer";
import { useEditCustomer } from "@/api-hooks/customer/use-edit-customer";
import PhoneCodePicker from "@/pages/components/admin/FormFields/PhoneCodePicker";

function CustomerModal({
  customer,
  triggerModalId,
  modalTitle,
  setCustomer,
}: {
  customer?: Customer;
  triggerModalId: string;
  modalTitle: string;
  setCustomer?: React.Dispatch<React.SetStateAction<Customer | undefined>>;
}) {
  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //---------------------------API----------------------------------

  const { mutate: addCustomer, isPending: isAdding } = useAddCustomer({
    callBackOnSuccess: () => {
      reset();
      setTimeout(() => {
        cancelFormRef.current?.click();
      }, 10);
    },
  });

  const { mutate: editCustomer, isPending: isEditing } = useEditCustomer({
    id: customer?._id!,
    callBackOnSuccess: () => {
      reset();
      setCustomer && setCustomer(undefined);
      setTimeout(() => {
        cancelFormRef.current?.click();
      }, 10);
    },
  });

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(apiValidations.CustomerSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      address: "",
      tvaNumber: "",
      note: "",
    },
  });

  const onSubmit = (data: CustomerSchema) => {
    const dataToSend: CustomerSchema = {
      ...data,
      email: data.email && data.email.length > 0 ? data.email : undefined,
    };
    if (customer) editCustomer(dataToSend);
    else addCustomer(dataToSend);
  };

  // when clicking edit in the table, for the first ms, the state is not initialized, so we need to reset the form state
  useEffect(() => {
    if (customer) {
      reset({
        name: customer?.name,
        phoneNumber: customer?.phoneNumber,
        email: customer?.email,
        address: customer?.address,
        tvaNumber: customer?.tvaNumber,
        note: customer?.note,
      });
    } else {
      reset({
        name: "",
        phoneNumber: "",
        email: "",
        address: "",
        tvaNumber: "",
        note: "",
      });
    }
  }, [customer]);

  // when pressing enter in the input field, we need to add the ingredient
  const onInvalid = (errors: any) => console.error(errors);
  return (
    <Modal
      id={triggerModalId}
      size="md"
      onClose={() => {
        setCustomer && setCustomer(undefined);
        reset();
      }}
    >
      <Modal.Header title={modalTitle} id={triggerModalId} />
      <Modal.Body>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="grid grid-cols-12 gap-x-2 items-center"
        >
          <TextField
            control={control}
            name="name"
            label="Customer Name"
            placeholder="customer name"
            colSpan={4}
          />
          <TextField
            control={control}
            name="email"
            label="Email"
            placeholder="customer@gmail.com"
            colSpan={4}
            dontCapitalize
          />
          <PhoneCodePicker
            control={control}
            name="phoneNumber"
            label="Phone Number"
            colSpan={4}
          />
          <TextField
            control={control}
            name="address"
            label="Address"
            placeholder="customer address"
            colSpan={12}
          />
          <TextField
            control={control}
            name="tvaNumber"
            label="Vat Number"
            placeholder="123456"
            colSpan={12}
          />
          <TextField
            control={control}
            name="note"
            label="Note"
            placeholder="This customer is VIP."
            colSpan={12}
          />
        </form>
      </Modal.Body>

      <Modal.Footer>
        <button
          disabled={isAdding || isEditing}
          ref={cancelFormRef}
          type="button"
          className="hs-dropdown-toggle ti-btn ti-btn-secondary"
          data-hs-overlay={`#${triggerModalId}`}
        >
          Cancel
        </button>
        <button
          disabled={isAdding || isEditing}
          type="button"
          onClick={() => {
            formRef.current?.requestSubmit();
          }}
          className="ti-btn ti-btn-primary-full"
        >
          {isAdding || isEditing ? "Submitting..." : "Submit"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomerModal;
