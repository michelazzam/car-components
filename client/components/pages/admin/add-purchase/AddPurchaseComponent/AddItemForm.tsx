import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDebounce } from "../../../../../hooks/useDebounce";
import { usePurchaseFormStore } from "@/shared/store/usePurchaseStore";
import TextFieldControlled from "@/components/admin/FormControlledFields/TextFieldControlled";
import NumberFieldControlled from "@/components/admin/FormControlledFields/NumberFieldControlled";
import DateFieldControlled from "@/components/admin/FormControlledFields/DateFieldControlled";
import { BsPlusCircle } from "react-icons/bs";
import Link from "next/link";
import {
  AddPurchaseItemSchemaType,
  apiValidations,
} from "@/lib/apiValidations";
import { useListProducts } from "@/api-hooks/products/use-list-products";
import SelectFieldControlled from "@/components/admin/FormControlledFields/SelectFieldControlled";
import AddEditProductModal from "../../menu/AddEditProductModal";
import { FaPlus } from "react-icons/fa6";
import { formatNumber } from "@/lib/helpers/formatNumber";
import NumberWithSelectOptionsField from "@/components/admin/Fields/NumberWithSelectOptionsField";

function AddItemForm() {
  //----------------------------------CONSTANTS--------------------------------------

  //----------------------------------STATES--------------------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);

  //----------------------------------STORE--------------------------------------
  const {
    addItem,
    formValues: { items },
  } = usePurchaseFormStore();

  //----------------------------------API CALLS-------------------------------------
  const { data } = useListProducts({
    search: debouncedSearchQuery,
  });
  const products = data?.items?.filter((p) => {
    const isInStore = items.find((item) => item.itemId === p._id);
    return !isInStore;
  });
  const productsOptions =
    products?.map((product) => ({
      value: product._id || "",
      label: product.name || "",
    })) || [];

  //----------------------------------FORM SETUP------------------------------------
  const { control, handleSubmit, reset, setValue, watch } =
    useForm<AddPurchaseItemSchemaType>({
      resolver: zodResolver(apiValidations.AddPurchaseItemSchema),
      defaultValues: {
        itemId: "",
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        quantityFree: 0,
        discount: 0,
        discountType: "fixed",
        expDate: "",
        totalPrice: 0,
        lotNumber: "",
      },
    });

  // Watch specific fields to update totalPrice
  const price = useWatch({ control, name: "price" });
  const quantity = useWatch({ control, name: "quantity" });
  const discount = useWatch({ control, name: "discount" });
  const totalPrice = watch("totalPrice");
  const discountType = watch("discountType");
  // const vat = useWatch({ control, name: "vat" });
  //----------------------------------EFFECTS--------------------------------------

  useEffect(() => {
    const itemDiscount = discount || 0;
    // Calculate total when price, quantity, discount, or vat changes
    const itemPrice = price * quantity;

    const discountAmount =
      discountType === "percentage"
        ? itemPrice * (itemDiscount / 100)
        : itemDiscount;
    const subtotal = itemPrice - discountAmount;
    // const vatAmount = subtotal * (vat / 100);
    const total = subtotal;
    // + vatAmount;

    setValue("totalPrice", Number(total.toFixed(2)));
  }, [price, quantity, discount, discountType, setValue]);

  // useEffect(() => {
  //   if (addingProduct && Object.keys(addingProduct).length !== 0) {
  //     setValue("description", addingProduct?.description);
  //     setValue("price", addingProduct?.price);
  //   }
  // }, [addingProduct]);

  //----------------------------------HANDLERS--------------------------------------
  const onSubmit = (data: AddPurchaseItemSchemaType) => {
    console.log("ADDING ITEM WITH TOTAL PRICE: ", data.totalPrice);
    addItem({
      ...data,
      itemId: data.itemId,
      name: data.name || "",
      discount: data.discount,
      discountType: data.discountType,
      totalPrice: data.totalPrice,
      returns: data.returns || [],
    });
    reset();
  };

  const onError = (errors = {}) => {
    console.log("error", errors);
  };

  return (
    <div className="d-flex justify-content-between mb-4 mt-4 ">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="grid grid-cols-12 gap-x-2">
          <div className="col-span-6">
            <SelectFieldControlled
              colSpan={12}
              onInputChange={(value) => {
                setSearchQuery(value);
              }}
              onObjectChange={(value) => {
                console.log("VALUE", value);
                setValue("name", value?.label);
              }}
              control={control}
              options={productsOptions || []}
              name="itemId"
              label="Product Name"
              placeholder={"Select Product"}
              AddButton={<AddButton />}
            />
          </div>

          <TextFieldControlled
            colSpan={6}
            control={control}
            name="description"
            label="Description"
          />

          <NumberFieldControlled
            colSpan={3}
            control={control}
            name="price"
            label="Unit Price"
            type={"formattedNumber"}
            prefix="$"
          />

          <NumberFieldControlled
            colSpan={3}
            control={control}
            name="quantity"
            label="Quantity"
            type={"number"}
          />

          <NumberFieldControlled
            colSpan={3}
            control={control}
            name="quantityFree"
            label="Quantity Free"
            type={"number"}
          />

          <NumberWithSelectOptionsField
            colSpan={3}
            label="Discount"
            // type={"formattedNumber"}

            onChangeValue={(value) => {
              setValue(
                "discountType",
                value as string as "fixed" | "percentage"
              );
            }}
            onBlur={(value) => {
              console.log("ON BLUR VALUE", value);
              setValue("discount", value as number);
            }}
            options={[
              {
                label: "%",
                value: "percentage",
              },
              {
                label: "$",
                value: "fixed",
              },
            ]}
            value={discount}
            selectValue={discountType}
            decimalsLimit={0}
          />

          <TextFieldControlled
            colSpan={3}
            control={control}
            name="lotNumber"
            label="Lot Number"
          />

          <DateFieldControlled
            colSpan={3}
            formatType="dd-MM-yyyy"
            control={control}
            name="expDate"
            label="Exp.Date"
          />

          <div className="flex items-center justify-end col-span-6">
            <p className="text-end">
              TOTAL ITEM PRICE:{" "}
              <span className="text-black font-bold text-lg">
                ${formatNumber(totalPrice, 2)}
              </span>
            </p>
          </div>

          <div className="w-full flex justify-end col-span-12">
            <button className="ti-btn ti-btn-secondary " type="submit">
              <BsPlusCircle className=" " width={18} height={18} />
              <span className="fw-bold ">Add Product</span>
            </button>
          </div>
        </div>
      </form>
      <AddEditProductModal
        triggerModalId="add-product-modal"
        modalTitle="Add Product"
      />
    </div>
  );
}

export default AddItemForm;

const AddButton = () => {
  return (
    <Link
      href={"#"}
      data-bs-toggle="modal"
      data-hs-overlay="#add-product-modal"
      className="ti-btn ti-btn-icon flex items-center justify-center ti-btn-primary"
    >
      <FaPlus />
    </Link>
  );
};
