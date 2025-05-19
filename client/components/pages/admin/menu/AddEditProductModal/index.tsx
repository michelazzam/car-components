import Modal from "@/shared/Modal";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, ProductSchema } from "@/lib/apiValidations";
import TextFieldControlled from "@/components/admin/FormControlledFields/TextFieldControlled";
import NumberFieldControlled from "@/components/admin/FormControlledFields/NumberFieldControlled";
import { useAddProduct } from "@/api-hooks/products/use-add-product";
import { Product } from "@/api-hooks/products/use-list-products";
import { useEditProduct } from "@/api-hooks/products/use-edit-product";
import { useListSupplier } from "@/api-hooks/supplier/use-list-supplier";
import { useDebounce } from "@/hooks/useDebounce";
import SelectFieldControlled from "@/components/admin/FormControlledFields/SelectFieldControlled";
import { SelectOption } from "@/components/admin/Fields/SlectField";
import { ITEM_STATUSES_OPTIONS, itemStatuses } from "@/lib/constants/item";

function AddEditProductModal({
  product,
  triggerModalId,
  modalTitle,
  setProduct,
}: {
  product?: Product;
  triggerModalId: string;
  modalTitle: string;
  setProduct?: React.Dispatch<React.SetStateAction<Product | undefined>>;
}) {
  //--------------state----------
  const [supplierSearch, setSupplierSearch] = useState("");
  const supplierDeboundSearch = useDebounce(supplierSearch);

  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //---------------------------API----------------------------------
  const { mutate: addProduct, isPending: isAdding } = useAddProduct({
    callBackOnSuccess: () => {
      reset();
      setTimeout(() => {
        cancelFormRef.current?.click();
      }, 10);
    },
  });

  const { mutate: editProduct, isPending: isEditing } = useEditProduct({
    id: product?._id!,
    callBackOnSuccess: () => {
      reset();
      setProduct && setProduct(undefined);
      setTimeout(() => {
        cancelFormRef.current?.click();
      }, 10);
    },
  });

  const { data: supplier } = useListSupplier({ search: supplierDeboundSearch });

  const supplierOptions = supplier?.suppliers.map((supplier) => {
    return {
      label: supplier.name,
      value: supplier._id,
    };
  }) as SelectOption[];

  //----Getting Data for Options-----
  // const { data: categories } = useListCategories();
  // const { data: printers } = useListPrinters();

  //---------------------------Options---------------------------------
  // const categoriesOptions = categories?.map((category) => ({
  //   label: category.name,
  //   value: category._id,
  // }));

  // const printersOptions = printers?.map((printer) => ({
  //   label: printer.name,
  //   value: printer._id,
  // }));

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset } = useForm<ProductSchema>({
    resolver: zodResolver(apiValidations.AddEditProduct),
    defaultValues: {
      name: product?.name || "",
      note: product?.note || "",
      supplierId: product?.supplier._id || "",
      price: product?.price || 0,
      cost: product?.cost || 0,
      quantity: product?.quantity || 0,
      status: product?.status || itemStatuses[0],
    },
  });

  // const [ingredients, setIngredients] = useState<
  //   {
  //     label: string;
  //     value: string;
  //   }[]
  // >(
  //   product?.ingredients.map((ingredient) => ({
  //     label: ingredient,
  //     value: uuid4(),
  //   })) || []
  // );

  const onSubmit = (data: ProductSchema) => {
    if (product) editProduct(data);
    else addProduct(data);
  };

  // when clicking edit in the table, for the first ms, the state is not initialized, so we need to reset the form state
  useEffect(() => {
    if (product) {
      reset({
        name: product?.name,
        note: product?.note,
        supplierId: product?.supplier._id,
        price: product?.price,
        cost: product?.cost,
        quantity: product?.quantity,
        status: product.status,
      });
    } else {
      reset({
        name: "",
        note: "",
        supplierId: "",
        price: 0,
        cost: 0,
        quantity: 0,
        status: itemStatuses[0],
      });
    }
  }, [product]);

  // when pressing enter in the input field, we need to add the ingredient
  const onInvalid = (errors: any) => console.error(errors);
  return (
    <Modal
      id={triggerModalId}
      size="md"
      onClose={() => {
        setProduct && setProduct(undefined);
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
          <TextFieldControlled
            control={control}
            name="name"
            label="Name"
            placeholder="name"
            colSpan={6}
          />
          <SelectFieldControlled
            control={control}
            label="supplier"
            name="supplierId"
            options={supplierOptions || []}
            placeholder={"choose supplier"}
            creatable={false}
            onInputChange={(e) => {
              setSupplierSearch(e);
              // setValue("supplierId", "");
            }}
            // onObjectChange={(e) => {
            //   setValue("supplierId", e);
            // }}
          />
          {/* <NumberField
            control={control}
            name="stock"
            label="Stock "
            colSpan={!product ? 3 : 4}
          /> */}
          <NumberFieldControlled
            control={control}
            // readOnly={product ? true : false}
            name="cost"
            label="Cost"
            colSpan={6}
            prefix="$"
          />
          <NumberFieldControlled
            control={control}
            name="price"
            label="Selling Price"
            prefix="$"
            colSpan={6}
          />
          {/* in case of editing a product, we don't need to show the stock field */}
          <NumberFieldControlled
            control={control}
            // readOnly={product ? true : false}
            label="Quantity"
            name="quantity"
            colSpan={6}
          />
          <SelectFieldControlled
            control={control}
            label="Status"
            name="status"
            options={ITEM_STATUSES_OPTIONS || []}
            placeholder={"choose status"}
            creatable={false}
            // onInputChange={(e) => {
            //   setSupplierSearch(e);
            //   // setValue("supplierId", "");
            // }}
            // onObjectChange={(e) => {
            //   setValue("supplierId", e);
            // }}
          />
          <TextFieldControlled
            control={control}
            name="note"
            label="Note"
            placeholder="note"
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

export default AddEditProductModal;
