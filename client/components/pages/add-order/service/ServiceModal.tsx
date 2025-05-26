import Modal from "@/shared/Modal";
import React, { useRef, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import NumberFieldControlled from "@/components/admin/FormControlledFields/NumberFieldControlled";
import { usePosStore } from "@/shared/store/usePosStore";
import { FaRegEdit } from "react-icons/fa";
import { FaPlus, FaRegTrashCan } from "react-icons/fa6";
import SelectFieldControlled from "@/components/admin/FormControlledFields/SelectFieldControlled";
import {
  Service,
  useListServices,
} from "@/api-hooks/services/use-list-services";
import { useAddService } from "@/api-hooks/services/use-add-service";
import { AddInvoiceSchema } from "@/lib/apiValidations";
import toast from "react-hot-toast";
interface ServiceSchema {
  name: {
    label: string;
    value: string;
  } | null;
  quantity: number;
  price: number;
}

const ServiceModal = ({
  triggerModalId,
  modalTitle,
}: {
  triggerModalId: string;
  modalTitle: string;
}) => {
  const formContext = useFormContext<AddInvoiceSchema>();
  const { getValues } = formContext;
  const servicesIdsNotAllowed = getValues()
    ?.items?.map((item) => {
      if (item.serviceRef !== undefined) {
        return item.serviceRef;
      } else {
        return;
      }
    })
    .filter((item) => item !== undefined);

  //------------------------State-----------------------------------
  const [services, setServices] = useState<ServiceSchema[]>([]);
  const [editingService, setEditingService] = useState<
    ServiceSchema | undefined
  >();
  //-------------------------API-------------------------------
  const { data } = useListServices();
  const servicesOptions =
    data &&
    data.map((exp) => {
      return {
        label: exp?.name,
        value: exp?._id,
        price: exp?.price,
      };
    });

  const { mutate: addService } = useAddService({
    callBackOnSuccess: (resp: Service) => {
      setValue("name", {
        label: resp.name,
        value: resp._id,
      });
    },
  });
  //-------------------------Storage-------------------------------
  const { addToCart } = usePosStore();

  //---------------------------service validation------------------
  const serviceValidation = z.object({
    name: z.object({
      label: z.string().min(1, "Name label is required"),
      value: z.string().min(1, "Name value is required"),
    }),

    quantity: z.number().min(1, "At least 1"),
    price: z.number().min(1, "> 0"),
  });

  //---------------------------REFS------------------------------
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //-------------------------Form-----------------------------------
  const { control, handleSubmit, reset, setValue, watch } =
    useForm<ServiceSchema>({
      resolver: zodResolver(serviceValidation),
      defaultValues: {
        name: { label: "", value: "" },
        quantity: 0,
        price: 0,
      },
    });
  const watchNameValue = watch("name");
  console.log(watchNameValue?.value);
  //------------------------Functions----------------------------------

  const handleDelete = (data: ServiceSchema) => {
    const newServices = services.filter(
      (item) => !(item.name === data.name && item.price === data.price)
    );
    setServices(newServices);
  };

  const handleEdit = (data: ServiceSchema) => {
    setEditingService(data);
    reset({
      name: data.name,
      quantity: data.quantity,
      price: data.price,
    });
  };

  const onSubmit = (data: ServiceSchema) => {
    const isDuplicate =
      !editingService &&
      services?.some((item) => {
        if (item?.name?.value === data?.name?.value) {
          toast.error("You can't add the same service twice");
          return true;
        }

        return false;
      });
    if (isDuplicate) {
      return;
    }

    if (
      data?.name?.value &&
      servicesIdsNotAllowed?.includes(data?.name?.value)
    ) {
      toast.error(
        "You can't add the same service " + data.name.label + " twice"
      );
      return;
    }

    if (editingService) {
      const newServices = services.map((item) =>
        item === editingService ? data : item
      );

      setServices(newServices);
      setEditingService(undefined);
      reset({
        name: {
          label: "",
          value: "",
        },
        quantity: 0,
        price: 0,
      });
    } else {
      setServices((prevServices) => [...prevServices, data]);
      reset({
        name: {
          label: "",
          value: "",
        },
        quantity: 0,
        price: 0,
      }); // Reset form fields after adding service
    }
  };

  //-----------------ADDING SERVICES TO STORE----------------
  const submitServices = () => {
    for (let i = 0; i < services?.length; i++) {
      addToCart("service", {
        name: services[i].name?.label,
        cost: 0,
        quantity: services[i].quantity,
        price: services[i].price,
        _id: services[i].name?.value,
      });
    }

    setServices([]);
    cancelFormRef.current?.click();
  };

  const onInvalid = (errors: any) => console.error(errors);

  const handleCreateOption = (data: string) => {
    addService({
      name: data,
    });
  };

  return (
    <div>
      <Modal
        id={triggerModalId}
        size="md"
        onOpen={() => {
          console.log("open");
        }}
        onClose={() => {
          setServices([]);
        }}
      >
        <Modal.Header title={modalTitle} id={triggerModalId} />
        <form
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              // Trigger form submission
              document.getElementById("submitButton")?.click();
            }
          }}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
        >
          <Modal.Body>
            {services?.length > 0 && (
              <div className="grid grid-cols-12 gap-x-2 items-center justify-between mb-2">
                <span className="col-span-3">Service Name</span>
                <span className="col-span-3">Quantity</span>
                <span className="col-span-3">Price</span>
                <span className="col-span-3">Actions</span>
              </div>
            )}
            {services?.length > 0 &&
              services.map((service, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-x-2 items-center justify-between mb-2"
                  >
                    <span className="col-span-3">{service?.name?.label}</span>
                    <span className="col-span-3">{service.quantity}</span>
                    <span className="col-span-3">${service.price}</span>
                    <div className="col-span-3 gap-2">
                      <button
                        id="edit-btn"
                        type="button"
                        className="btn btn-sm btn-primary edit-btn text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white me-2"
                        onClick={() => handleEdit(service)}
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        type="button"
                        id="delete-btn"
                        className="btn btn-sm btn-danger delete-btn text-danger border border-danger rounded-md p-1 hover:bg-danger hover:text-white"
                        onClick={() => handleDelete(service)}
                      >
                        <FaRegTrashCan />
                      </button>
                    </div>
                  </div>
                );
              })}
            <div className="grid grid-cols-11 gap-x-2 items-center justify-between">
              <SelectFieldControlled
                control={control}
                name="name"
                label="Name"
                isClearable
                options={servicesOptions || []}
                placeholder={"Choose Service"}
                colSpan={3}
                creatable={true}
                handleCreate={handleCreateOption}
                onObjectChange={(obj) => {
                  if (obj) {
                    setValue("price", obj.price);
                  } else {
                    setValue("name", { label: "", value: "" });
                  }
                }}
                // onInputChange={(value) => setSearchQuery(value)}
                treatAsObject
              />
              <NumberFieldControlled
                control={control}
                name="quantity"
                label="Quantity"
                colSpan={3}
              />
              <div className="col-span-3 relative">
                <NumberFieldControlled
                  control={control}
                  name="price"
                  label="Price (per unit)"
                  colSpan={4}
                  prefix="$"
                  onChangeValue={(val) => {
                    setValue("price", Number(val));
                  }}
                />
              </div>
              <button
                id="submitButton"
                type="submit"
                className=" ti ti-btn ti-btn-primary text-primary col-span-2 border border-primary rounded-md flex items-center justify-center h-10 mt-2"
              >
                <FaPlus />
              </button>
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
              disabled={
                (watchNameValue?.value && watchNameValue?.value?.length > 0) ||
                (services?.length > 0 ? false : true)
              }
              className="ti-btn ti-btn-primary-full disabled:opacity-50 disbled:!cursor-not-allowed"
              type="button"
              onClick={() => {
                submitServices();
              }}
            >
              {false ? "Submitting..." : "Submit"}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default ServiceModal;
