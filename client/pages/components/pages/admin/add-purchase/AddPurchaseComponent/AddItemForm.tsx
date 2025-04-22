import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDebounce } from "../../../../../../hooks/useDebounce";
import { usePurchase } from "@/shared/store/usePurchaseStore";
import TextFieldControlled from "@/pages/components/admin/FormControlledFields/TextFieldControlled";
import NumberFieldControlled from "@/pages/components/admin/FormControlledFields/NumberFieldControlled";
import DateFieldControlled from "@/pages/components/admin/FormControlledFields/DateFieldControlled";
import { BsPlusCircle } from "react-icons/bs";
import SelectField from "@/pages/components/admin/Fields/SlectField";
import Link from "next/link";
import {
  AddPurchaseItemSchemaType,
  apiValidations,
} from "@/lib/apiValidations";
import { useListProducts } from "@/api-hooks/products/use-list-products";

function AddItemForm() {
  //----------------------------------CONSTANTS--------------------------------------

  //----------------------------------STATES--------------------------------------
  const [productsOptions, setProductsOptions] = useState<
    | {
        value: string;
        label: string;
      }[]
    | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);

  //----------------------------------STORE--------------------------------------
  const { addProduct, addingProduct } = usePurchase();
  console.log("addingProduct", addingProduct);

  //----------------------------------API CALLS-------------------------------------
  const { data } = useListProducts({
    search: debouncedSearchQuery,
  });
  const products = data?.items;

  //----------------------------------FORM SETUP------------------------------------
  const { control, handleSubmit, reset, setValue } =
    useForm<AddPurchaseItemSchemaType>({
      resolver: zodResolver(apiValidations.AddPurchaseItemSchema),
      defaultValues: {
        product: {},
        description: "",
        price: 0,
        quantity: 0,
        quantityFree: 0,
        discount: 0,

        expDate: "",
        totalPrice: 0,
      },
    });

  // Watch specific fields to update totalPrice
  const price = useWatch({ control, name: "price" });
  const quantity = useWatch({ control, name: "quantity" });
  const discount = useWatch({ control, name: "discount" });
  // const vat = useWatch({ control, name: "vat" });
  //----------------------------------EFFECTS--------------------------------------
  useEffect(() => {
    setProductsOptions(
      products?.map((product) => ({
        value: product._id || "",
        label: product.name || "",
      })) || []
    );
  }, [products]);

  useEffect(() => {
    // Calculate total when price, quantity, discount, or vat changes
    const subtotal = price * quantity - discount;
    // const vatAmount = subtotal * (vat / 100);
    const total = subtotal;
    // + vatAmount;

    setValue("totalPrice", Number(total.toFixed(2)));
  }, [price, quantity, discount, setValue]);

  // useEffect(() => {
  //   //set the vat to the tva
  //   tva > 0 ? setValue("vat", Number(tva)) : setValue("vat", 0);
  // }, [tva]);

  useEffect(() => {
    console.log(addingProduct);
    if (addingProduct && Object.keys(addingProduct).length !== 0) {
      setValue("product", addingProduct?.product);
      setValue("description", addingProduct?.description);
      setValue("price", addingProduct?.price);
    }
  }, [addingProduct]);

  //----------------------------------HANDLERS--------------------------------------
  const onSubmit = (data: AddPurchaseItemSchemaType) => {
    addProduct({ ...data, itemId: data.itemId });
    reset();
  };

  const onError = (errors = {}) => {
    console.log("error", errors);
  };

  return (
    <div className="d-flex justify-content-between mb-4 mt-4 ">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="row w-100">
          <div className="col-6">
            <SelectField
              colSpan={12}
              onInputChange={(value) => {
                setSearchQuery(value);
              }}
              control={control}
              options={productsOptions || []}
              name="product"
              label="Product Name"
              placeholder={"Select Product"}
              //@ts-ignore
              AddButton={AddButton}
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

          <NumberFieldControlled
            colSpan={3}
            control={control}
            name="discount"
            label="Discount($)"
            type={"formattedNumber"}
            prefix="$"
          />

          <NumberFieldControlled
            readOnly
            colSpan={3}
            control={control}
            name="vat"
            label="VAT(%)"
            type={"formattedNumber"}
            prefix="%"
          />

          <NumberFieldControlled
            colSpan={3}
            control={control}
            name="lotNumber"
            label="Lot Number"
            type={"number"}
          />

          <DateFieldControlled
            colSpan={3}
            control={control}
            name="expDate"
            label="Exp.Date"
          />

          <NumberFieldControlled
            colSpan={3}
            readOnly
            control={control}
            name="totalPrice"
            label="Total Amount"
            type={"formattedNumber"}
            prefix="$"
          />

          <div className="w-full d-flex justify-content-end">
            <button
              className="mb-3 bg-transparent border-1 py-1 rounded-2 d-flex align-items-center gap-1 "
              type="submit"
            >
              <BsPlusCircle className=" text-black" width={18} height={18} />
              <span className="fw-bold text-black">Add Product</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddItemForm;

const AddButton = () => {
  return (
    <Link
      href={"#"}
      data-bs-toggle="modal"
      data-bs-target="#add-product-modal"
      className="btn btn-submit py-2"
    >
      <i className="fa fa-plus" aria-hidden="true"></i>
    </Link>
  );
};
