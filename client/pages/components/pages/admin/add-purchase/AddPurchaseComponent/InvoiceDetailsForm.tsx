import { useListSupplier } from "@/api-hooks/supplier/use-list-supplier";
import DateFieldControlled from "@/pages/components/admin/FormControlledFields/DateFieldControlled";
import PhoneCodePickerControlled from "@/pages/components/admin/FormControlledFields/PhoneCodePickerControlled";
import SelectFieldControlled from "@/pages/components/admin/FormControlledFields/SelectFieldControlled";
import TextFieldControlled from "@/pages/components/admin/FormControlledFields/TextFieldControlled";
import React from "react";

function InvoiceDetailsForm({ control }: { control: any }) {
  const { data: suppliersResponse } = useListSupplier({});
  const suppliers = suppliersResponse?.suppliers || [];

  const suppliersOptions = suppliers?.map((supplier) => ({
    value: supplier._id,
    label: supplier.name,
  }));

  return (
    <div
      className="row border p-2 shadow-sm w-100 h-100"
      style={{ borderRadius: "8px" }}
    >
      <SelectFieldControlled
        placeholder={"Select"}
        colSpan={4}
        control={control}
        name="supplier"
        label="Supplier"
        options={suppliersOptions || []}
      />

      <TextFieldControlled
        colSpan={4}
        control={control}
        name="invoiceNumber"
        label="Invoice Number"
      />

      <DateFieldControlled
        control={control}
        name="invoiceDate"
        label="Invoice Date"
        placeholder={"Select Date"}
        colSpan={4}
      />

      <TextFieldControlled
        colSpan={4}
        control={control}
        name="salesOrder"
        label="Sales Order"
      />

      <TextFieldControlled
        colSpan={4}
        control={control}
        name="customerConsultant"
        label="Customer Consultant"
      />

      <PhoneCodePickerControlled
        colSpan={6}
        control={control}
        name="phoneNumber"
        label="Phone Number"
      />
    </div>
  );
}

export default InvoiceDetailsForm;
