import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, ProductSchema } from "@/lib/apiValidations";
import TextField from "@/pages/components/admin/FormFields/TextField";
import NumberField from "@/pages/components/admin/FormFields/NumberField";
import { useAddProduct } from "@/api-hooks/products/use-add-product";
import { Product } from "@/api-hooks/products/use-list-products";
import { useEditProduct } from "@/api-hooks/products/use-edit-product";

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
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(apiValidations.AddEditProduct),
    defaultValues: {
      name: product?.name || "",
      brand: product?.brand || "",
      price: product?.price || 0,
      cost: product?.cost || 0,
      stock: product?.stock || 0,
      note: product?.note || "",
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
        brand: product?.brand,
        price: product?.price,
        cost: product?.cost,
        stock: product?.stock,
        note: product?.note,
      });
    } else {
      reset({
        name: "",
        brand: "",
        price: 0,
        cost: 0,
        stock: 0,
        note: "",
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
          <TextField
            control={control}
            name="name"
            label="Name"
            placeholder="name"
            colSpan={6}
          />
          <TextField
            control={control}
            name="brand"
            label="Brand"
            placeholder="brand name"
            colSpan={6}
          />
          {/* <NumberField
            control={control}
            name="stock"
            label="Stock "
            colSpan={!product ? 3 : 4}
          /> */}
          <NumberField
            control={control}
            name="cost"
            label="Cost"
            colSpan={6}
            prefix="$"
          />
          <NumberField
            control={control}
            name="price"
            label="Price"
            prefix="$"
            colSpan={6}
          />
          {/* in case of editing a product, we don't need to show the stock field */}
          {!product && (
            <NumberField
              control={control}
              name="stock"
              label="Stock"
              colSpan={12}
            />
          )}
          <TextField
            control={control}
            name="note"
            label="Note"
            placeholder="Add note"
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
