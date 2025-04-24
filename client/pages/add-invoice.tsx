import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment, useEffect, useState } from "react";
import RightSideAddOrder from "./components/pages/add-order/RightSideAddOrder";
import ItemsList from "./components/pages/add-order/ItemsList";
import Header from "./components/pages/add-order/Header";
import { useListProducts } from "@/api-hooks/products/use-list-products";
import { useDebounce } from "@/hooks/useDebounce";
import { useForm, FormProvider } from "react-hook-form";
import { Item, usePosStore } from "@/shared/store/usePosStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddInvoiceSchema, apiValidations } from "@/lib/apiValidations";

const AddInvoice = () => {
  //-----------------State----------------
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  //-------------------Storage-------------------
  const {
    editingInvoice,
    applyDiscount,
    discountStore,
    addGroupItem,
    cart,
    clearCart,
    totalAmount
  } = usePosStore();

  //--------------------API----------------------
  const { data: products, refetch: refetchProducts } = useListProducts({
    search: debouncedSearch,
  });

  type ProcessedItem = {
    itemRef?: string;
    serviceRef?: string;
    quantity: number;
    discount?: {
      amount: number;
      type: string;
    };
    subTotal: number;
    totalPrice: number;
  };

  const processCart = (cart: Item[]): ProcessedItem[] => {
    const items = cart.map((item) => ({
      itemRef: item.type === "product" ? item.productId : undefined,
      serviceRef: item.type === "service" ? item.productId : undefined,
      quantity: item.quantity || 1,
      discount: item.discount
        ? {
            amount: item.discount.amount,
            type: item.discount.type,
          }
        : undefined,
      subTotal: item.price && item.quantity ? item.price * item.quantity : 0,
      totalPrice: item.amount ?? 0,
    }));
  
    return items;
  };
  
  const items = processCart(cart);


  //----------------FORM-------------------------
  const methods = useForm<AddInvoiceSchema>({
    resolver: zodResolver(apiValidations.AddInvoiceSchema),
    defaultValues: {
      driverName: "",
      discount: {
        amount: 0,
        type: "fixed",
      },
      paidAmountUsd: 0,
      customerId: "",
      customer: {},
      vehicle: {},
      isPaid: false,
      hasVehicle: true,
      vehicleId: "",
      // products: cart.filter((item) => item.type === "product") || [],
      // services: cart.filter((item) => item.type === "service") || [],
      items:items,
      generalNote: "",
      customerNote: "",
      invoiceNumber: 0,
      subTotalUsd:0,
      totalUsd:0,
      type:"s1"
    },
  });

  //-----------------Effects-----------------------------
  useEffect(() => {
    if (editingInvoice) {
      // Reset form with editing invoice details
      methods.reset({
        driverName: editingInvoice.driverName,
        discount: {
          amount: editingInvoice.discount.amount,
          type: editingInvoice.discount.type,
        },
        paidAmountUsd: editingInvoice.paidAmountUsd,
        customerId: editingInvoice.customer._id,
        vehicleId: editingInvoice.vehicle?._id || "",
        isPaid: editingInvoice.isPaid,
        hasVehicle: editingInvoice.vehicle?._id ? true : false,
        products: editingInvoice.products,
        services: editingInvoice.services,
        generalNote: editingInvoice.generalNote,
        customerNote: editingInvoice.customerNote,
        invoiceNumber: editingInvoice.invoiceNumber,
      });

      // Clear cart before adding items
      clearCart(); // Optional if you want to ensure the cart is empty

      // Add products and services from editingInvoice
      if (editingInvoice.products && editingInvoice.products.length > 0) {
        console.log(editingInvoice.products);
        addGroupItem("product", editingInvoice.products);
      }
      if (editingInvoice.services && editingInvoice.services.length > 0) {
        addGroupItem("service", editingInvoice.services);
      }

      // discount apply
      applyDiscount(
        editingInvoice.discount.amount,
        editingInvoice.discount.type
      );

      // Set the form values based on the cart
      // methods.setValue("products", editingInvoice.products);
      // methods.setValue("services", editingInvoice.services);
    }
  }, [editingInvoice, applyDiscount, addGroupItem, clearCart, methods]);

  useEffect(() => {
    // Filter and map products with valid productId, quantity, and price
    const products =
      cart
        .filter(
          (item) =>
            item.type === "product" &&
            item.productId &&
            item.quantity !== undefined &&
            item.price !== undefined
        )
        .map((item) => ({
          productId: item.productId!,
          quantity: item.quantity!,
          price: item.price!, // Price is guaranteed to be defined now
        })) || [];

    // Filter and map services with valid name, quantity, and price
    const services =
      cart
        .filter(
          (item) =>
            item.type === "service" &&
            item.name &&
            item.quantity !== undefined &&
            item.price !== undefined
        )
        .map((item) => ({
          name: item.name!,
          quantity: item.quantity!,
          price: item.price!, // Price is guaranteed to be defined now
        })) || [];
        const items = processCart(cart);
        methods.setValue("items",items);

    // Set the form values
    methods.setValue("products", products);
    methods.setValue("services", services);
    const subTotalUsd = cart.reduce((accumulator, currentItem) => {
      return accumulator + (currentItem.amount || 0);
    }, 0);
    methods.setValue("subTotalUsd",subTotalUsd);
    methods.setValue("totalUsd", totalAmount())
  
  }, [cart, methods]);

  useEffect(() => {
  methods.setValue("totalUsd" , totalAmount());
  },[discountStore])



  return (
    <Fragment>
      <Seo title="Table list" />
      <div className="grid grid-cols-12 h-calculate-60px  ">
        <FormProvider {...methods}>
          <div className="col-span-9 pt-2">
            <Header search={search} setSearch={setSearch} />
            <ItemsList products={products?.items} />
          </div>
          <div className="col-span-3">
            <RightSideAddOrder refetchProducts={refetchProducts} />
          </div>
        </FormProvider>
      </div>
    </Fragment>
  );
};

AddInvoice.layout = "Contentlayout";

export default AddInvoice;
