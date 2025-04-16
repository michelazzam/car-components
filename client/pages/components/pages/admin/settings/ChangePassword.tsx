"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, ChangePassword } from "@/lib/apiValidations";
import { useForm } from "react-hook-form";
import PasswordField from "../../../../components/admin/FormFields/PasswordField";
import { useChangePassword } from "@/api-hooks/users/use-change-password";

interface ChangePasswordProps {
  setShowEditPasswordPage: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChangePasswordPage: React.FC<ChangePasswordProps> = ({
  setShowEditPasswordPage,
}) => {
  //----------------------------Forms----------------------------------------

  const {
    control,
    handleSubmit,
    reset,

    formState: { isDirty },
  } = useForm<ChangePassword>({
    resolver: zodResolver(apiValidations.changePassword),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  //----------------------------API-----------------------------------

  const mutation = useChangePassword({
    callBackOnSuccess: () => {
      reset();
      setShowEditPasswordPage(false);
      // closeModal();
    },
  });

  const onSubmitEdit = (data: ChangePassword) => {
    console.log(data);
    mutation.mutate(data);
  };
  const onInvalid = (errors: any) => console.error(errors);
  return (
    <>
      <div className=" w-full">
        <div className="">
          <form
            onSubmit={handleSubmit(onSubmitEdit, onInvalid)}
            className="bg-white shadow-md rounded-lg p-6 w-full mx-auto"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Change Password
              </h2>
            </div>

            <div className="grid grid-cols-12 gap-x-2 items-center justify-between">
              <PasswordField
                control={control}
                label="Current Password"
                name="currentPassword"
                colSpan={12}
              />
              <PasswordField
                control={control}
                label="New Password"
                name="newPassword"
                colSpan={12}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <>
                <button
                  type="button"
                  className="bg-primary text-white px-4 py-2 rounded-lg mr-4 hover:bg-white hover:text-primary border border-primary "
                  onClick={() => {
                    setShowEditPasswordPage(false);
                    // setValue("fullName", currentUser.fullName);
                    // setValue("username", currentUser.username);
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
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordPage;
