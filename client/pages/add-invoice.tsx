import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment, useEffect, useRef, useState } from "react";
import RightSideAddOrder from "../components/pages/add-order/RightSideAddOrder";
import ItemsList from "../components/pages/add-order/ItemsList";
import Header from "../components/pages/add-order/Header";
import { useListProducts } from "@/api-hooks/products/use-list-products";
import { useDebounce } from "@/hooks/useDebounce";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { Item, usePosStore } from "@/shared/store/usePosStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddInvoiceSchema, apiValidations } from "@/lib/apiValidations";
import { v4 as uuidv4 } from "uuid";

export const addInvoiceDefaultValues: AddInvoiceSchema = {
  driverName: "",
  paymentMethods: [],
  discount: {
    amount: 0,
    type: "fixed",
  },
  paidAmountUsd: 0,
  customerId: "",
  swaps: [],
  customer: {},
  vehicle: {},
  isPaid: false,
  hasVehicle: true,
  vehicleId: "",
  items: [],
  customerNote: "",
  subTotalUsd: 0,
  totalUsd: 0,
  type: "s1",
  taxesUsd: 0,
};

const AddInvoice = () => {
  //-----------------State----------------
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  //-------------------Storage-------------------
  const {
    editingInvoice,
    applyDiscount,
    discountStore,
    vatAmount,
    addGroupItem,
    cart,
    clearCart,
    totalAmount,
    upsertDraftInvoice,
    draftInvoices,
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
    price: number;
    subTotal: number;
    totalPrice: number;
  };

  const processCart = (cart: Item[]): ProcessedItem[] => {
    const items = cart.map((item) => ({
      name: item.name,
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
      price: item.price || 0,
    }));

    return items;
  };

  const items = processCart(cart);

  //----------------FORM-------------------------
  const methods = useForm<AddInvoiceSchema>({
    resolver: zodResolver(apiValidations.AddInvoiceSchema),
    defaultValues: {
      ...addInvoiceDefaultValues,
      items: items,
    },
  });

  const { control, watch, reset } = methods;

  const watchAll = watch();
  const watchCustomerId = watch("customerId");
  const customer = watch("customer");
  const draftIdRef = useRef<string>(uuidv4());
  const lastSavedRef = useRef<string>("");

  // keep the *previous* customerId here:
  const prevCustomerIdRef = useRef<string>("");

  // 1) Load or init draft when customer changes
  useEffect(() => {
    const cid = watchCustomerId;
    if (!cid) {
      console.log("NO CID");
      prevCustomerIdRef.current = cid;
      console.log("prevCustomerIdRef.current = ", prevCustomerIdRef.current);
      return;
    } else {
      console.log("CID EXISTS");
      console.log("PREV CUSTOMER REF. CURRENT = ", prevCustomerIdRef.current);
    }

    const existing = draftInvoices.find((d) => d.customerId === cid);
    if (existing) {
      draftIdRef.current = existing.draft_invoice_id;
      reset(existing as AddInvoiceSchema);
    } else {
      draftIdRef.current = uuidv4();

      if (prevCustomerIdRef.current) {
        console.log("RESETING .... ..... .... ");
        clearCart();
        reset({
          ...addInvoiceDefaultValues,
          customerId: cid,
          customer: customer,
          items: [],
        });
      }
    }
    prevCustomerIdRef.current = cid;
  }, [watchCustomerId, draftInvoices, reset]);

  // Debounce whole form object
  const debouncedForm = useDebounce(watchAll, 1000);

  // 2) Autosave only if values changed, preserve isCurrent
  useEffect(() => {
    const vals = debouncedForm;
    if (!vals.customerId) return;
    const payload = JSON.stringify(vals);
    if (payload === lastSavedRef.current) return;
    lastSavedRef.current = payload;

    // preserve existing isCurrent flag if switching or saving
    const existing = draftInvoices.find(
      (d) => d.draft_invoice_id === draftIdRef.current
    );
    upsertDraftInvoice({
      ...vals,
      draft_invoice_id: draftIdRef.current,
      isCurrent: existing?.isCurrent ?? false,
    });
  }, [debouncedForm, upsertDraftInvoice, draftInvoices]);

  // 3) Change discount, discount type , items in store when draft changes

  useEffect(() => {
    const draft = draftInvoices.find(
      (d) => d.draft_invoice_id === draftIdRef.current
    );
    if (!draft) return;
    //store
    console.log("DRAFT ITEMS ARE : ", draft.items);
    clearCart();
    //add items to cart
    const productItems: any[] = [];
    const serviceItems: any[] = [];

    draft?.items?.forEach((item) => {
      if (item.itemRef) {
        productItems.push(item);
      } else {
        serviceItems.push(item);
      }
    });

    if (productItems.length > 0) {
      addGroupItem("product", productItems);
    }
    if (serviceItems.length > 0) {
      addGroupItem("service", serviceItems);
    }

    applyDiscount(
      draft.discount.amount,
      draft.discount.type as "fixed" | "percentage"
    );
  }, [draftIdRef.current]);

  const swapsFieldArrayMethods = useFieldArray({ control, name: "swaps" });

  const isB2C = methods.watch("type") === "s2";
  //-----------------Effects-----------------------------
  useEffect(() => {
    if (editingInvoice) {
      // Reset form with editing invoice details
      methods.reset({
        discount: {
          amount: editingInvoice.accounting.discount.amount,
          type: editingInvoice.accounting.discount.type,
        },
        swaps: editingInvoice.swaps || [],
        paymentMethods: editingInvoice.paymentMethods || [],
        paidAmountUsd: editingInvoice.accounting.paidAmountUsd,
        customerId: editingInvoice.customer._id,
        vehicleId: editingInvoice.vehicle?._id || "",
        isPaid: editingInvoice.accounting.isPaid,
        hasVehicle: editingInvoice.vehicle?._id ? true : false,
        customerNote: editingInvoice.customerNote,
        type: editingInvoice.type,
      });

      // Clear cart before adding items
      clearCart(); // Optional if you want to ensure the cart is empty

      // Add products and services from editingInvoice
      const productItems: any[] = [];
      const serviceItems: any[] = [];
      editingInvoice.items.forEach((item) => {
        if (item.itemRef) {
          productItems.push(item);
        } else {
          serviceItems.push(item);
        }
      });

      if (productItems.length > 0) {
        addGroupItem("product", productItems);
      }
      if (serviceItems.length > 0) {
        addGroupItem("service", serviceItems);
      }

      // discount apply
      applyDiscount(
        editingInvoice.accounting.discount.amount,
        editingInvoice.accounting.discount.type
      );
    }
  }, [editingInvoice, applyDiscount, addGroupItem, clearCart, methods]);

  useEffect(() => {
    methods.setValue("items", items);
    const subTotalUsd = cart.reduce((accumulator, currentItem) => {
      return accumulator + (currentItem.amount || 0);
    }, 0);
    methods.setValue("subTotalUsd", subTotalUsd);
    methods.setValue("totalUsd", totalAmount(!isB2C));
  }, [cart, methods, isB2C]);

  useEffect(() => {
    if (discountStore) {
      methods.setValue("totalUsd", totalAmount(!isB2C));
    }
  }, [discountStore]);

  useEffect(() => {
    methods.setValue("taxesUsd", vatAmount);
  }, [vatAmount]);

  return (
    <Fragment>
      <Seo title="Table list" />
      <div className="grid grid-cols-12 h-calculate-60px  ">
        <FormProvider {...methods}>
          <div className="col-span-9 pt-2">
            <Header
              search={search}
              setSearch={setSearch}
              swapsFieldArrayMethods={swapsFieldArrayMethods}
            />
            <ItemsList products={products?.items} />
          </div>
          <div className="col-span-3">
            <RightSideAddOrder
              swapsFieldArrayMethods={swapsFieldArrayMethods}
              refetchProducts={refetchProducts}
            />
          </div>
        </FormProvider>
      </div>
    </Fragment>
  );
};

AddInvoice.layout = "Contentlayout";

export default AddInvoice;
