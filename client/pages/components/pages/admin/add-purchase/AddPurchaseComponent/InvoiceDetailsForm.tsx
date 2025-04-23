import { useListSupplier } from "@/api-hooks/supplier/use-list-supplier";
import { AddPurchaseSchemaType } from "@/lib/apiValidations";
import DateFieldControlled from "@/pages/components/admin/FormControlledFields/DateFieldControlled";
import PhoneCodePickerControlled from "@/pages/components/admin/FormControlledFields/PhoneCodePickerControlled";
import SelectFieldControlled from "@/pages/components/admin/FormControlledFields/SelectFieldControlled";
import TextFieldControlled from "@/pages/components/admin/FormControlledFields/TextFieldControlled";
import { usePurchase } from "@/shared/store/usePurchaseStore";
import React from "react";
import { useFormContext } from "react-hook-form";

function InvoiceDetailsForm() {
  const { control } = useFormContext<AddPurchaseSchemaType>();
  const { setSupplier } = usePurchase();
  const { data: suppliersResponse } = useListSupplier({});
  const suppliers = suppliersResponse?.suppliers || [];

  const suppliersOptions = suppliers?.map((supplier) => ({
    value: supplier._id,
    label: supplier.name,
    ...supplier,
  }));

  return (
    <div
      className="row border p-2 shadow-sm grid grid-cols-12 gap-x-2"
      style={{ borderRadius: "8px" }}
    >
      <SelectFieldControlled
        placeholder={"Select"}
        colSpan={4}
        control={control}
        name="supplierId"
        label="Supplier"
        onObjectChange={(value) => {
          setSupplier(value);
        }}
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
        formatType="dd-MM-yyyy"
        colSpan={4}
      />

      <TextFieldControlled
        colSpan={6}
        control={control}
        name="customerConsultant"
        label="Customer Consultant"
      />

      <PhoneCodePickerControlled
        colSpan={12}
        control={control}
        name="phoneNumber"
        label="Phone Number"
      />
    </div>
  );
}

export default InvoiceDetailsForm;
