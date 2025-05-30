// src/shared/store/usePurchaseFormStore.ts
import { Purchase } from "@/api-hooks/purchase/use-list-purchase";
import { apiValidations } from "@/lib/apiValidations";
import { ZodError } from "zod";
import create from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

//
// 1) Your unified formValues type
//
export interface PurchaseItem {
  itemId: string;
  name: string;
  description: string;
  quantity: number;
  totalPrice: number;
  price: number;
  quantityFree: number;
  discount: number;
  discountType: "percentage" | "fixed";
  lotNumber: string;
  expDate: string;
}

// name: "",

export interface SupplierOption {
  value: string;
  label: string;
}

export interface FormValues {
  invoiceNumber: string;
  invoiceDate: string; // ISO date
  supplier: SupplierOption | null;
  customerConsultant: string;
  phoneNumber: string;

  items: PurchaseItem[];

  paymentAmount: number;

  tvaPercent: number;
  vatLBP: number;

  subTotal: number;
  totalWithTax: number;
  totalPaid: number;
  totalDue: number;

  usdRate: number;
}

//
// 2) The store interface
//
interface PurchaseFormState {
  formValues: FormValues;
  editingPurchase: Purchase | null;
  errors: any;
  // single setter
  setFieldValue: <K extends keyof FormValues>(
    field: K,
    value: FormValues[K]
  ) => void;
  setEditingPurchase: (purchase: Purchase | undefined) => void;
  populatePurchase: (purchase: Purchase, usdRate: number) => void;
  // item‐helpers
  addItem: (item: PurchaseItem) => void;
  removeItem: (itemId: string) => void;

  // recompute everything
  recalcTotals: () => void;

  //validate form
  isFormValid: (addErros?: boolean) => { data: FormValues; errors: ZodError[] };
  // reset
  reset: () => void;
}

//
// 3) Initial form values
//
const initialFormValues: FormValues = {
  invoiceNumber: "",
  invoiceDate: new Date().toISOString().slice(0, 10),
  supplier: null,
  customerConsultant: "",
  phoneNumber: "",

  items: [],

  paymentAmount: 0,

  tvaPercent: 11,
  vatLBP: 0,

  subTotal: 0,
  totalWithTax: 0,
  totalPaid: 0,
  totalDue: 0,

  usdRate: 0,
};

//
// 4) Create the store
//
export const usePurchaseFormStore = create<PurchaseFormState>()(
  persist(
    (set, get) => ({
      formValues: initialFormValues,
      editingPurchase: null,
      errors: {},

      isFormValid: (addErrors = true) => {
        console.log("CHECKING IF FORM IS VALID");
        const { formValues } = get();
        const schema = apiValidations.AddPurchaseSchema;
        const validation = schema.safeParse(formValues);

        if (!validation.success) {
          console.log("VALIDATION ERROR", validation.error);
          if (addErrors) {
            set({ errors: validation.error.flatten().fieldErrors });
          }
          return {
            data: formValues,
            errors: [validation.error],
          };
        }
        // form is valid
        console.log("FORM IS VALID");
        set({ errors: {} });
        return {
          data: formValues,
          errors: [],
        };
      },
      populatePurchase: (purchase, usdRate) => {
        // Map API Purchase → FormValues
        const mappedItems: PurchaseItem[] = purchase.items.map((i) => ({
          itemId: i.itemId,
          name: i.name,
          description: i.description,
          quantity: i.quantity,
          price: i.price,
          totalPrice: i.totalPrice,
          quantityFree: i.quantityFree,
          discount: i.discount,
          discountType: "fixed",
          lotNumber: i.lotNumber,
          expDate: i.expDate.slice(0, 10), // assume ISO string
        }));

        set({
          formValues: {
            usdRate: usdRate,
            invoiceNumber: purchase.invoiceNumber ?? "",
            invoiceDate: purchase.invoiceDate.slice(0, 10),
            supplier: purchase.supplier
              ? { value: purchase.supplier._id, label: purchase.supplier.name }
              : null,
            customerConsultant: purchase.customerConsultant,
            phoneNumber: purchase.phoneNumber,
            items: mappedItems,
            paymentAmount: purchase.amountPaid,
            tvaPercent: purchase.vatPercent,
            vatLBP: purchase.vatLBP,

            // If your backend already sent these, you can skip recomputing—
            // otherwise recalcTotals() below will overwrite.
            subTotal: purchase.subTotal ?? 0,
            totalWithTax: purchase.totalAmount,
            totalPaid: purchase.amountPaid,
            totalDue: purchase.totalAmount - purchase.amountPaid,
          },
        });

        // now compute any derived fields you prefer to recalc
        get().recalcTotals();
      },

      setEditingPurchase: (purchase) => {
        set({ editingPurchase: purchase });
      },
      setFieldValue: (field, value) => {
        set((state) => ({
          formValues: {
            ...state.formValues,
            [field]: value,
          },
        }));
        // immediately recalc any derived totals
        get().recalcTotals();
        get().isFormValid(false);
      },

      addItem: (item) => {
        set((state) => ({
          formValues: {
            ...state.formValues,
            items: [...state.formValues.items, item],
          },
        }));
        get().recalcTotals();
      },

      removeItem: (itemId) => {
        set((state) => ({
          formValues: {
            ...state.formValues,
            items: state.formValues.items.filter((i) => i.itemId !== itemId),
          },
        }));
        get().recalcTotals();
      },

      recalcTotals: () => {
        const fv = get().formValues;
        const subTotal = fv.items.reduce((sum, i) => sum + i.totalPrice, 0);
        const taxFromPercent = parseFloat(
          ((subTotal * fv.tvaPercent) / 100).toFixed(2)
        );
        const totalWithTax = subTotal + taxFromPercent;
        const totalPaid = fv.paymentAmount;
        const totalDue = totalWithTax - totalPaid;

        set((state) => ({
          formValues: {
            ...state.formValues,
            subTotal,
            totalWithTax,
            totalPaid,
            totalDue,
          },
        }));
      },

      reset: () => {
        set({ formValues: initialFormValues, editingPurchase: null });
      },
    }),
    {
      name: "Car Components Purchase Storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
