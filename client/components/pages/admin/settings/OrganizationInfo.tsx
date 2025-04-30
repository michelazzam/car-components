import React, { useState } from "react";
import PhoneCodePickerControlled from "../../../admin/FormControlledFields/PhoneCodePickerControlled";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, OrganizationSchema } from "@/lib/apiValidations";
import { useForm } from "react-hook-form";
import TextFieldControlled from "../../../admin/FormControlledFields/TextFieldControlled";
import { OrganizationInfoType } from "@/api-hooks/restaurant/use-get-organization-info";
import { BsPencilSquare } from "react-icons/bs";
import { useEditOrganizationInfo } from "@/api-hooks/restaurant/use-edit-organization-info";
import NumberFieldControlled from "@/components/admin/FormControlledFields/NumberFieldControlled";

const OrganizationInfo = ({
  organization,
}: {
  organization: OrganizationInfoType;
}) => {
  //--------------------------------State----------------------------------
  const [editable, setEditable] = useState(false);

  //----------------------------Forms----------------------------------------
  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<OrganizationSchema>({
    resolver: zodResolver(apiValidations.EditOrganization),
    defaultValues: {
      ...organization,
    },
  });

  //----------------------------API-----------------------------------

  const mutation = useEditOrganizationInfo({
    callBackOnSuccess: () => setEditable(false),
  });

  const onSubmit = (data: OrganizationSchema) => {
    mutation.mutate(data);
  };

  //---------------------------Functions-------------------------------
  const handleCancel = () => {
    setEditable(false);
    if (organization) {
      reset({
        ...organization,
      });
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="container mx-auto py-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white shadow-md rounded-lg p-6 w-full mx-auto"
          >
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Organization Information
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
                label="Organization Name"
                name="name"
                placeholder="joe G"
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
                label="Email"
                name="email"
                placeholder=""
                colSpan={6}
                readOnly={!editable}
              />
              <TextFieldControlled
                control={control}
                label="VAT Number"
                name="tvaNumber"
                placeholder=""
                colSpan={6}
                readOnly={!editable}
              />
              <NumberFieldControlled
                prefix="%"
                control={control}
                label="VAT Percentage"
                name="tvaPercentage"
                placeholder=""
                colSpan={6}
                readOnly={!editable}
              />
              <TextFieldControlled
                control={control}
                label="Address"
                name="address"
                placeholder="Address"
                colSpan={6}
                readOnly={!editable}
              />
            </div>

            <div className="mt-6 flex justify-end">
              {editable && (
                <>
                  <button
                    disabled={mutation.isPending}
                    type="button"
                    className="bg-primary text-white px-4 py-2 rounded-lg mr-4 hover:bg-white hover:text-primary border border-primary "
                    onClick={() => {
                      handleCancel();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!isDirty || mutation.isPending}
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
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default OrganizationInfo;
