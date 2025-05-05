import { useListSupplier } from "@/api-hooks/supplier/use-list-supplier";
import { AddPurchaseSchemaType } from "@/lib/apiValidations";
import DateFieldControlled from "@/components/admin/FormControlledFields/DateFieldControlled";
import PhoneCodePickerControlled from "@/components/admin/FormControlledFields/PhoneCodePickerControlled";
import SelectFieldControlled from "@/components/admin/FormControlledFields/SelectFieldControlled";
import TextFieldControlled from "@/components/admin/FormControlledFields/TextFieldControlled";
import { usePurchase } from "@/shared/store/usePurchaseStore";
import React from "react";
import { useFormContext } from "react-hook-form";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

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
      className=" p-2  grid grid-cols-12 gap-x-2 "
      style={{ borderRadius: "8px" }}
    >
      <SelectFieldControlled
        placeholder={"Select"}
        colSpan={6}
        control={control}
        name="supplierId"
        label="Supplier"
        onObjectChange={(value) => {
          setSupplier(value);
        }}
        AddButton={<AddButton />}
        options={suppliersOptions || []}
      />

      <TextFieldControlled
        colSpan={6}
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
        colSpan={6}
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
