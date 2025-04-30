import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, CategorySchema } from "@/lib/apiValidations";
import TextFieldControlled from "@/components/admin/FormControlledFields/TextFieldControlled";
import { Category } from "@/api-hooks/categories/use-list-categories";
import { useAddCategory } from "@/api-hooks/categories/use-add-category";
import { useEditCategory } from "@/api-hooks/categories/use-edit-category";

function AddEditCategoryModal({
  triggerModalId,
  category,
}: {
  triggerModalId: string;
  category?: Category;
}) {
  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //---------------------------API----------------------------------
  const { mutate: addCategory, isPending: isAdding } = useAddCategory({
    callBackOnSuccess: () => {
      reset();
      cancelFormRef.current?.click();
    },
  });

  const { mutate: editCategory, isPending: isEditing } = useEditCategory({
    id: category?._id!,
    callBackOnSuccess: () => {
      cancelFormRef.current?.click();
    },
  });

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset } = useForm<CategorySchema>({
    resolver: zodResolver(apiValidations.AddEditCategory),
    defaultValues: {
      name: category?.name || "",
    },
  });

  const onFormSubmit = (data: CategorySchema) => {
    if (category) editCategory(data);
    else addCategory(data);
  };

  // when clicking edit in the table, for the first ms, the state is not initialized with the printer object, so we need to reset the form state
  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
      });
    }
  }, [category]);

  return (
    <Modal id={triggerModalId} size="xs">
      <Modal.Header title="Add Item" id={triggerModalId} />
      <Modal.Body>
        <form ref={formRef} onSubmit={handleSubmit(onFormSubmit)}>
          <TextFieldControlled
            control={control}
            name="name"
            label="Name"
            colSpan={6}
          />
        </form>
      </Modal.Body>

      <Modal.Footer>
        <button
          ref={cancelFormRef}
          type="button"
          className="hs-dropdown-toggle ti-btn ti-btn-secondary"
          data-hs-overlay={`#${triggerModalId}`}
        >
          Cancel
        </button>
        <button
          disabled={isAdding}
          type="submit"
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

export default AddEditCategoryModal;
