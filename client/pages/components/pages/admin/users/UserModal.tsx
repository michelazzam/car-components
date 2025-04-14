import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import TextField from "../../../../components/admin/FormFields/TextField";
import { useForm } from "react-hook-form";
import { AddUserSchema, apiValidations } from "@/lib/apiValidations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddUser } from "@/api-hooks/users/use-add-user";
import PhoneCodePicker from "../../../../components/admin/FormFields/PhoneCodePicker";
import PasswordField from "../../../../components/admin/FormFields/PasswordField";
import SelectField from "../../../../components/admin/FormFields/SelectField";
import { useEditUser } from "@/api-hooks/users/use-edit-user";
import { User, userRoles } from "@/api-hooks/users/use-list-users";

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
      fullName: "",
      username: "",
      role: "",
      password: "",
      phoneNumber: "",
      address: "",
    },
  });

  useEffect(() => {
    if (userEditing) {
      reset({
        fullName: userEditing.fullName,
        username: userEditing.username,
        address: userEditing.address,
        phoneNumber: userEditing.phoneNumber,
        role: userEditing.role,
      });
    }
  }, [userEditing]);

  //------------------------Functions----------------------------------

  const onSubmit = (data: AddUserSchema) => {
    if (userEditing) {
      data.password = data.password || undefined;
      editUser(data);
    } else {
      addUser(data, {
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
              <TextField
                control={control}
                label="Full Name*"
                name="fullName"
                placeholder="joe G"
                colSpan={6}
              />
              <TextField
                control={control}
                label="User Name*"
                name="username"
                placeholder="joe"
                colSpan={6}
              />
              <TextField
                control={control}
                label="address"
                name="address"
                colSpan={12}
              />
              <SelectField
                control={control}
                label="Role*"
                name="role"
                colSpan={12}
                creatable={false}
                options={roleOptions}
              />
              <PhoneCodePicker
                control={control}
                label="Phone Number"
                name="phoneNumber"
                colSpan={12}
              />

              <PasswordField
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
