import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, DBBackupPath } from "@/lib/apiValidations";
import { useForm } from "react-hook-form";
import TextField from "../../../admin/FormFields/TextField";
import { BsPencilSquare } from "react-icons/bs";
import { useEditDBBackupPath } from "@/api-hooks/db-backup/use-edit-DB-backup-path";

interface EditBackupPathProps {
  path: string | undefined;
}

const EditBackupPath: React.FC<EditBackupPathProps> = ({ path }) => {
  //--------------------------------State----------------------------------
  const [editable, setEditable] = useState(false);

  //----------------------------Forms----------------------------------------
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<DBBackupPath>({
    resolver: zodResolver(apiValidations.DBBackupPath),
    defaultValues: {
      path,
    },
  });

  //----------------------------API-----------------------------------
  const mutation = useEditDBBackupPath({
    callBackOnSuccess: () => {
      reset({
        path,
      });
      setEditable(false);
    },
  });

  //-----------------------Functions-------------------------------------------
  const onSubmitEdit = (data: DBBackupPath) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    setEditable(false);
    reset({
      path,
    });
  };

  const onInvalid = (errors: any) => console.error(errors);

  return (
    <form
      onSubmit={handleSubmit(onSubmitEdit, onInvalid)}
      className="bg-white shadow-md rounded-lg p-6 w-full mx-auto"
    >
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          DB Backup Config
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
        <TextField
          dontCapitalize
          control={control}
          label="Path"
          name="path"
          placeholder="/Users/xxx/Documents/"
          colSpan={12}
          readOnly={!editable}
        />
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

export default EditBackupPath;
