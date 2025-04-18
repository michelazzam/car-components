import React, { useEffect, useState } from "react";
import PhoneCodePickerControlled from "../../../admin/FormControlledFields/PhoneCodePickerControlled";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, ProfileSchema } from "@/lib/apiValidations";
import { useForm } from "react-hook-form";
import TextFieldControlled from "../../../admin/FormControlledFields/TextFieldControlled";
import { useEditProfile } from "@/api-hooks/users/use-edit-profile";
import UseAuth from "@/api-hooks/useAuth";
import { BsPencilSquare } from "react-icons/bs";

interface EditProfileProps {
  setShowEditPasswordPage: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({
  setShowEditPasswordPage,
  refetch,
}) => {
  //--------------------------------State----------------------------------
  const [editable, setEditable] = useState(false);

  //----------------------------Forms----------------------------------------

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(apiValidations.ProfileSchema),
    defaultValues: {
      fullName: "",
      username: "",
      phoneNumber: "",
      address: "",
    },
  });

  //----------------------------API-----------------------------------
  const { user } = UseAuth();

  const mutation = useEditProfile({
    callBackOnSuccess: () => {
      reset();
      refetch();
      setEditable(false);
      // closeModal();
    },
  });

  //---------------------------Effects-------------------------------
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        address: user.address,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user]);

  //-----------------------Functions-------------------------------------------

  const onSubmitEdit = (data: ProfileSchema) => {
    console.log(data);
    mutation.mutate(data);
  };

  const handleCancel = () => {
    setEditable(false);
    if (user) {
      reset({
        username: user.username,
        address: user.address,
        phoneNumber: user.phoneNumber,
      });
    }
  };

  const onInvalid = (errors: any) => console.error(errors);

  return (
    <form
      onSubmit={handleSubmit(onSubmitEdit, onInvalid)}
      className="bg-white shadow-md rounded-lg p-6 w-full mx-auto"
    >
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Profile Information
        </h2>
        {!editable && (
          <BsPencilSquare
            size={23}
            role="button"
            onClick={() => setEditable(true)}
          />
        )}
      </div>

      <div className="grid grid-cols-12 gap-x-2 items-center justify-between">
        <TextFieldControlled
          control={control}
          label="Full Name*"
          name="fullName"
          placeholder="joe G"
          colSpan={12}
          readOnly={!editable}
        />
        <TextFieldControlled
          control={control}
          label="User Name*"
          name="username"
          placeholder="joe"
          colSpan={6}
          readOnly={!editable}
        />
        <PhoneCodePickerControlled
          control={control}
          label="Phone Number"
          name="phoneNumber"
          colSpan={6}
          disabled={!editable}
        />
        <TextFieldControlled
          control={control}
          label="Address"
          name="address"
          placeholder=""
          colSpan={12}
          readOnly={!editable}
        />

        <div className="relative col-span-12">
          <button
            className="absolute right-0 top-0 text-sm text-danger hover:text-primary"
            onClick={() => setShowEditPasswordPage(true)}
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        {editable ? (
          <>
            <button
              type="button"
              className="bg-primary text-white px-4 py-2 rounded-lg mr-4 hover:bg-white hover:text-primary border border-primary "
              onClick={() => {
                handleCancel();
              }}
            >
              Cancel
            </button>
            <button
              disabled={!isDirty}
              type="submit"
              className={`bg-blue-500 text-primary px-4 py-2 rounded-lg border border-primary ${
                !isDirty
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-primary hover:text-white"
              }`}
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
          </>
        ) : null}
      </div>
    </form>
  );
};

export default EditProfile;
