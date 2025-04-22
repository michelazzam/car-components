import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { apiValidations } from "@/lib/apiValidations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PermissionAction,
  Permissions,
  User,
} from "@/api-hooks/users/use-list-users";
import CheckboxField from "@/pages/components/admin/FormControlledFields/CheckboxField";
import Checkbox from "@/pages/components/admin/Fields/Checkbox";
import useEditUserPermissions from "@/api-hooks/users/use-edit-user-permission";

const EditUserPermissionsModal = ({
  triggerModalId,
  title,
  editingUser,
}: {
  triggerModalId: string;
  title: string;
  editingUser?: User;
}) => {
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  const { mutate: editUserPermissions } = useEditUserPermissions({
    id: editingUser?._id ?? "",
    callBackOnSuccess: () => {
      reset();
      cancelFormRef.current?.click();
    },
  });

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<Permissions>({
      resolver: zodResolver(apiValidations.EditUserPermissions),
      mode: "onSubmit",
      defaultValues: {
        Customers: {
          create: false,
          update: false,
          read: false,
        },
        Invoices: {
          create: false,
          update: false,
          read: false,
        },
        Inventory: {
          create: false,
          update: false,
          read: false,
        },
        Purchases: {
          create: false,
          update: false,
          read: false,
        },
        Services: {
          create: false,
          update: false,
          read: false,
        },
        Suppliers: {
          create: false,
          update: false,
          read: false,
        },
        Organization: {
          create: false,
          update: false,
          read: false,
        },
        Expenses: {
          create: false,
          update: false,
          read: false,
        },
        Accounting: {
          create: false,
          update: false,
          read: false,
        },
      },
    });

  useEffect(() => {
    if (editingUser) {
      //THIS SOULD BE CHNAGED IFD  THE BACKEND SEND THE PERMISSIONS EVEN IF THEY ARE FALSE
      reset({
        Customers: {
          create: editingUser?.permissions?.Customers?.create,
          update: editingUser?.permissions?.Customers?.update,
          read: editingUser?.permissions?.Customers?.read,
        },
        Invoices: {
          create: editingUser?.permissions?.Invoices?.create,
          update: editingUser?.permissions?.Invoices?.update,
          read: editingUser?.permissions?.Invoices?.read,
        },
        Inventory: {
          create: editingUser?.permissions?.Inventory?.create,
          update: editingUser?.permissions?.Inventory?.update,
          read: editingUser?.permissions?.Inventory?.read,
        },
        Purchases: {
          create: editingUser?.permissions?.Purchases?.create,
          update: editingUser?.permissions?.Purchases?.update,
          read: editingUser?.permissions?.Purchases?.read,
        },
        Services: {
          create: editingUser?.permissions?.Services?.create,
          update: editingUser?.permissions?.Services?.update,
          read: editingUser?.permissions?.Services?.read,
        },
        Suppliers: {
          create: editingUser?.permissions?.Suppliers?.create,
          update: editingUser?.permissions?.Suppliers?.update,
          read: editingUser?.permissions?.Suppliers?.read,
        },
        Organization: {
          create: editingUser?.permissions?.Organization?.create,
          update: editingUser?.permissions?.Organization?.update,
          read: editingUser?.permissions?.Organization?.read,
        },
        Expenses: {
          create: editingUser?.permissions?.Expenses?.create,
          update: editingUser?.permissions?.Expenses?.update,
          read: editingUser?.permissions?.Expenses?.read,
        },
        Accounting: {
          create: editingUser?.permissions?.Accounting?.create,
          update: editingUser?.permissions?.Accounting?.update,
          read: editingUser?.permissions?.Accounting?.read,
        },
        Balance: {
          create: editingUser?.permissions?.Balance?.create,
          update: editingUser?.permissions?.Balance?.update,
          read: editingUser?.permissions?.Balance?.read,
        },
      });
    }
  }, [editingUser]);

  const onSubmit = (data: Permissions) => {
    editUserPermissions({
      permissions: {
        Customers: data.Customers,
        Invoices: data.Invoices,
        Inventory: data.Inventory,
        Purchases: data.Purchases,
        Services: data.Services,
        Suppliers: data.Suppliers,
        Organization: data.Organization,
        Expenses: data.Expenses,
        Accounting: data.Accounting,
        Balance: data.Balance,
      },
    });
  };
  const onError = (error: any) => {
    console.log(error);
  };
  return (
    <div>
      <Modal id={triggerModalId} size="lg">
        <Modal.Header title={title} id={triggerModalId} />
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Modal.Body>
            <table className="table whitespace-nowrap min-w-full">
              <thead>
                <tr className="border-b border-defaultborder">
                  <th scope="col" className="text-start">
                    Module
                  </th>
                  <th scope="col" className="text-start">
                    Create
                  </th>
                  <th scope="col" className="text-start">
                    Edit
                  </th>
                  {/* <th scope="col" className="text-start">
                    Delete
                  </th> */}
                  <th scope="col" className="text-start">
                    View
                  </th>
                  <th scope="col" className="text-start">
                    Allow all
                  </th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((modulePermission) => {
                  const createWatched =
                    watch(`${modulePermission.value}.create`) ?? true;
                  const updateWatched =
                    watch(`${modulePermission.value}.update`) ?? true;
                  const readWatched =
                    watch(`${modulePermission.value}.read`) ?? true;

                  const isAllChecked =
                    createWatched && updateWatched && readWatched;

                  return (
                    <tr
                      key={modulePermission.value}
                      className="border-b border-defaultborder"
                    >
                      <th scope="row" className="text-start">
                        {modulePermission.label}
                      </th>
                      {/* Create Checkbox */}
                      <td>
                        {modulePermission.permissions?.includes("create") && (
                          <CheckboxField
                            name={`${modulePermission.value}.create`}
                            control={control}
                            label=""
                          />
                        )}
                      </td>
                      {/* Update Checkbox */}
                      <td>
                        {modulePermission.permissions?.includes("update") && (
                          <CheckboxField
                            name={`${modulePermission.value}.update`}
                            control={control}
                            label=""
                          />
                        )}
                      </td>
                      {/* Delete Checkbox */}
                      {/* <td>
                        {modulePermission.permissions?.includes("delete") && (
                          <CheckboxField
                            name={`${modulePermission.value}.delete`}
                            control={control}
                            label=""
                          />
                        )}
                      </td> */}
                      {/* Read Checkbox */}
                      <td>
                        {modulePermission.permissions?.includes("read") && (
                          <CheckboxField
                            name={`${modulePermission.value}.read`}
                            control={control}
                            label=""
                          />
                        )}
                      </td>
                      {/* Allow all Checkbox */}
                      <td>
                        <Checkbox
                          id={modulePermission.value + "-allow-all"}
                          isChecked={isAllChecked}
                          onValueChange={(value) => {
                            // Update individual permissions based on 'allow all' toggle
                            setValue(
                              `${modulePermission.value}.create`,
                              value,
                              {
                                shouldValidate: true,
                              }
                            );
                            setValue(
                              `${modulePermission.value}.update`,
                              value,
                              {
                                shouldValidate: true,
                              }
                            );
                            // setValue(
                            //   `${modulePermission.value}.delete`,
                            //   value,
                            //   {
                            //     shouldValidate: true,
                            //   }
                            // );
                            setValue(`${modulePermission.value}.read`, value, {
                              shouldValidate: true,
                            });
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-b border-defaultborder">
                  <th scope="row" className="text-start">
                    Close Order
                  </th>
                  {/* Create Checkbox */}
                  <td>
                    <CheckboxField
                      name={`Order.close`}
                      control={control}
                      label=""
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="ti-btn ti-btn-secondary-full"
              data-hs-overlay={`#${triggerModalId}`}
              ref={cancelFormRef}
            >
              Close
            </button>
            <button className="ti-btn ti-btn-primary-full" type="submit">
              Submit
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default EditUserPermissionsModal;

interface PermissionEntry {
  label: string;
  value: keyof Permissions;
  permissions?: (keyof PermissionAction)[]; // Optional to handle cases without specific permissions
}

const permissions: PermissionEntry[] = [
  {
    label: "Customers",
    value: "Customers",
    permissions: ["create", "update", "read"],
  },
  {
    label: "Invoices",
    value: "Invoices",
    permissions: ["create", "update", "read"],
  },
  {
    label: "Inventory",
    value: "Inventory",
    permissions: ["create", "update", "read"],
  },
  {
    label: "Purchases",
    value: "Purchases",
    permissions: ["create", "update", "read"],
  },
  {
    label: "Services",
    value: "Services",
    permissions: ["create", "update", "read"],
  },
  {
    label: "Suppliers",
    value: "Suppliers",
    permissions: ["create", "update", "read"],
  },
  {
    label: "Organization",
    value: "Organization",
    permissions: ["create", "update", "read"],
  },
  {
    label: "Expenses",
    value: "Expenses",
    permissions: ["create", "update", "read"],
  },
  {
    label: "Accounting",
    value: "Accounting",
    permissions: ["create", "update", "read"],
  },
  {
    label: "Balance",
    value: "Balance",
    permissions: ["create", "update", "read"],
  },
];
