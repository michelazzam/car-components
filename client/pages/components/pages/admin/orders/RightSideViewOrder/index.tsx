import NumberFieldControlled from "@/pages/components/admin/FormControlledFields/NumberFieldControlled";
import PasswordFieldControlled from "@/pages/components/admin/FormControlledFields/PasswordFieldControlled";
import TextFieldControlled from "@/pages/components/admin/FormControlledFields/TextFieldControlled";
import React from "react";
import { useForm } from "react-hook-form";

function RightSideViewOrder() {
  const { control } = useForm();

  return (
    <div className="bg-white min-h-full -mr-[1.5rem]  px-3 py-4">
      <div className="grid grid-cols-2 gap-x-2 items-center justify-between ">
        <TextFieldControlled
          name="tableName"
          label="Table Name"
          colSpan={1}
          control={control}
          withCheckbox={false}
        />
        <NumberFieldControlled
          name="total"
          label="Total"
          colSpan={1}
          control={control}
          withCheckbox={false}
        />

        <PasswordFieldControlled
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
