import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import TextFieldControlled from "../../../admin/FormControlledFields/TextFieldControlled";
import { useForm } from "react-hook-form";
import { AddUserSchema, apiValidations } from "@/lib/apiValidations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddUser } from "@/api-hooks/users/use-add-user";
import PasswordFieldControlled from "../../../admin/FormControlledFields/PasswordFieldControlled";
import SelectFieldControlled from "../../../admin/FormControlledFields/SelectFieldControlled";
import { useEditUser } from "@/api-hooks/users/use-edit-user";
import { User, userRoles } from "@/api-hooks/users/use-list-users";
import NumberFieldControlled from "@/pages/components/admin/FormControlledFields/NumberFieldControlled";

const UserModal = ({
  triggerModalId,
  title,
  userEditing,
  setUserEditing,
}: {
  triggerModalId: string;
  title: string;
  userEditing?: User;
  setUserEditing: React.Dispatch<React.SetStateAction<User | undefined>>;
}) => {
  const roleOptions = userRoles.map((role) => ({
    label: role,
    value: role,
  }));

  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //------------------------API----------------------------------
  const { mutate: addUser, isPending: isAddPending } = useAddUser({
    callBackOnSuccess: () => {
      reset();
      cancelFormRef.current?.click();
    },
  });
  const { mutate: editUser, isPending: isEditPending } = useEditUser({
    id: userEditing?._id!,
    callBackOnSuccess: () => {
      reset();
      cancelFormRef.current?.click();
    },
  });
  //-------------------------Form-----------------------------------
  const { control, handleSubmit, reset } = useForm<AddUserSchema>({
    resolver: zodResolver(apiValidations.AddUser),
    defaultValues: {
      username: "",
      email: "",
      salary: 0,
      role: "",
      password: "",
    },
  });

  useEffect(() => {
    if (userEditing) {
      reset({
        username: userEditing.username,
        email: userEditing.email,
        salary: userEditing.salary,

        role: userEditing.role,
      });
    }
  }, [userEditing]);

  //------------------------Functions----------------------------------

  const onSubmit = (data: AddUserSchema) => {
    const dataToSend = {
      ...data,
      email: data.email && data.email.length > 0 ? data.email : undefined,
    };
    if (userEditing) {
      data.password = data.password || undefined;
      editUser(dataToSend);
    } else {
      addUser(dataToSend, {
        onSuccess: () => {
          cancelFormRef.current?.click();
        },
      });
    }
  };

  return (
    <div>
      <Modal
        id={triggerModalId}
        size="md"
        onClose={() => {
          setUserEditing(undefined);
        }}
        onOpen={() => {
          console.log("open");
        }}
      >
        <Modal.Header title={title} id={triggerModalId} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="grid grid-cols-12 gap-x-2 items-center justify-between">
              <TextFieldControlled
                control={control}
                label="User Name*"
                name="username"
                placeholder="joe"
                colSpan={6}
              />
              <TextFieldControlled
                control={control}
                label="Email"
                name="emil"
                colSpan={6}
              />
              <SelectFieldControlled
                control={control}
                label="Role*"
                name="role"
                colSpan={12}
                creatable={false}
                options={roleOptions}
              />
              <NumberFieldControlled
                control={control}
                label="Salary"
                name="salary"
                colSpan={12}
              />
              <PasswordFieldControlled
                control={control}
                label="Password"
                name="password"
                colSpan={12}
              />
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button
              ref={cancelFormRef}
              type="button"
              className="hs-dropdown-toggle ti-btn ti-btn-secondary-full"
              data-hs-overlay={`#${triggerModalId}`}
            >
              Close
            </button>
            <button
              disabled={isAddPending}
              className="ti-btn ti-btn-primary-full"
              type="submit"
              onClick={() => {
                formRef.current?.requestSubmit();
              }}
            >
              {isAddPending || isEditPending ? "Submitting..." : "Submit"}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default UserModal;
