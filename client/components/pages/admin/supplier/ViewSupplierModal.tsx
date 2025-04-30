import Modal from "@/shared/Modal";
import React, { useRef } from "react";
import { Supplier } from "@/api-hooks/supplier/use-list-supplier";

const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
};

const SUPPLIER_SECTIONS = [
  {
    title: "Financial Information",
    fields: [
      { label: "Amount Due", key: "amountDue", formatter: formatCurrency },
      { label: "Capital", key: "capital", formatter: formatCurrency },
      { label: "Loan", key: "loan", formatter: formatCurrency },
    ],
  },
  {
    title: "Contact Information",
    fields: [
      { label: "PO Box", key: "poBox" },
      { label: "Address", key: "address" },
      { label: "Phone Number", key: "phoneNumber" },
      { label: "Fax", key: "fax" },
      { label: "Extension", key: "ext" },
      { label: "Email", key: "email" },
      { label: "Website", key: "website" },
    ],
  },
  {
    title: "Company Details",
    fields: [
      { label: "Name", key: "name" },
      { label: "VAT Number", key: "vatNumber" },
      { label: "Extra Info", key: "extraInfo" },
      { label: "Created At", key: "createdAt", formatter: formatDate },
    ],
  },
];

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center space-x-4">
    <div className="w-1/3 font-semibold text-gray-700">{label}:</div>
    <div className="w-2/3 text-gray-600">{value}</div>
  </div>
);

function ViewSupplierModal({
  triggerModalId,
  supplier,
}: {
  triggerModalId: string;
  supplier?: Supplier;
}) {
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  const renderSupplierData = () => {
    if (!supplier) {
      return (
        <div className="text-center text-gray-600">
          No supplier data available.
        </div>
      );
    }

    return SUPPLIER_SECTIONS.map((section) => (
      <div key={section.title} className="mb-6">
        <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">
          {section.title}
        </h3>
        <div className="space-y-3">
          {section.fields.map(({ label, key, formatter }) => {
            const rawValue = supplier[key as keyof Supplier];
            let value: string;

            if (formatter) {
              value = formatter(rawValue as any);
            } else {
              value =
                rawValue !== null && rawValue !== undefined
                  ? String(rawValue)
                  : "N/A";
              value = value || "N/A"; // Handle empty strings
            }

            return <InfoRow key={key} label={label} value={value} />;
          })}
        </div>
      </div>
    ));
  };

  return (
    <Modal id={triggerModalId} size="md">
      <Modal.Header title="View Supplier" id={triggerModalId} />
      <Modal.Body>{renderSupplierData()}</Modal.Body>
      <Modal.Footer>
        <button
          ref={cancelFormRef}
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

export default ViewSupplierModal;
