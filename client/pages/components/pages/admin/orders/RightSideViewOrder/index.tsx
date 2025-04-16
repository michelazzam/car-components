import NumberField from "@/pages/components/admin/FormFields/NumberField";
import PasswordField from "@/pages/components/admin/FormFields/PasswordField";
import TextField from "@/pages/components/admin/FormFields/TextField";
import React from "react";
import { useForm } from "react-hook-form";

function RightSideViewOrder() {
  const { control } = useForm();

  return (
    <div className="bg-white min-h-full -mr-[1.5rem]  px-3 py-4">
      <div className="grid grid-cols-2 gap-x-2 items-center justify-between ">
        <TextField
          name="tableName"
          label="Table Name"
          colSpan={1}
          control={control}
          withCheckbox={false}
        />
        <NumberField
          name="total"
          label="Total"
          colSpan={1}
          control={control}
          withCheckbox={false}
        />

        <PasswordField
          name="password"
          label="Password"
          colSpan={1}
          control={control}
          withCheckbox={false}
        />
      </div>
    </div>
  );
}

export default RightSideViewOrder;
