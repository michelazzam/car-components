import { useListSupplier } from "@/api-hooks/supplier/use-list-supplier";
import { usePurchaseFormStore } from "@/shared/store/usePurchaseStore";
import React, { useState } from "react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import SelectField from "@/components/admin/Fields/SlectField";
import TextField from "@/components/admin/Fields/TextField";
import DateField from "@/components/admin/Fields/DateField";
import PhoneCodePicker from "@/components/admin/Fields/PhoneCodePicker";

function InvoiceDetailsForm() {
  const [supplierSearch, setSupplierSearc] = useState("");

  const { setFieldValue, formValues, errors } = usePurchaseFormStore();
  const { data: suppliersResponse } = useListSupplier({
    search: supplierSearch,
  });
  const suppliers = suppliersResponse?.suppliers || [];
  const suppliersOptions = suppliers?.map((supplier) => ({
    value: supplier._id,
    label: supplier.name,
    ...supplier,
  }));
  return (
    <div
      className=" p-2  grid grid-cols-12 gap-x-2 "
      style={{ borderRadius: "8px" }}
    >
      <SelectField
        errorMessage={errors.supplier?.[0]}
        onInputChange={(value) => {
          setSupplierSearc(value);
        }}
        value={formValues.supplier}
        placeholder={"Select"}
        colSpan={6}
        label="Supplier"
        onChangeValue={(value) => {
          setFieldValue("supplier", value as any);
        }}
        AddButton={<AddButton />}
        options={suppliersOptions || []}
      />

      <TextField
        colSpan={6}
        errorMessage={errors.invoiceNumber?.[0]}
        onChange={(value) => {
          if (value) {
            setFieldValue("invoiceNumber", value);
          }
        }}
        value={formValues.invoiceNumber}
        label="Invoice Number"
      />

      <DateField
        value={new Date(formValues.invoiceDate)}
        onChange={(value) => {
          if (value && typeof value === "string") {
            setFieldValue("invoiceDate", value);
          }
        }}
        label="Invoice Date"
        placeholder={"Select Date"}
        formatType="dd-MM-yyyy"
        colSpan={6}
      />

      <TextField
        colSpan={6}
        value={formValues.customerConsultant}
        onChange={(value) => {
          if (value) {
            setFieldValue("customerConsultant", value);
          }
        }}
        label="Customer Consultant"
      />

      <PhoneCodePicker
        colSpan={12}
        value={formValues.phoneNumber}
        onChange={(value) => {
          if (value) {
            setFieldValue("phoneNumber", value);
          }
        }}
        label="Phone Number"
      />
    </div>
  );
}

export default InvoiceDetailsForm;
const AddButton = () => {
  return (
    <Link
      href={"#"}
      data-bs-toggle="modal"
      data-hs-overlay="#add-supplier-modal"
      className="ti-btn ti-btn-icon flex items-center justify-center ti-btn-primary !mb-0"
    >
      <FaPlus />
    </Link>
  );
};
