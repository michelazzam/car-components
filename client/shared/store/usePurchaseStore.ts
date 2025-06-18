// src/shared/store/usePurchaseFormStore.ts
import { Purchase } from "@/api-hooks/purchase/use-list-purchase";
import { apiValidations, ReturnItemSchemaType } from "@/lib/apiValidations";
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
  returns: {
    quantityReturned: number;
    returnedAt: string;
  }[];
  expDate: string;
}

// name: "",

export interface SupplierOption {
  value: string;
  label: string;
}
export interface DraftPurchase extends FormValues {
  draft_purchase_id: string;
  isCurrent: boolean;
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
  draftPurchases: DraftPurchase[];
  currentDraftId: string | null;

  setCurrentDraftId: (id: string | null) => void;
  upserDraftPurchase: (
    draft: FormValues & { draft_purchase_id?: string; isCurrent?: boolean }
  ) => void;
  populateDraftPurchase: (draftId: string) => void;
  deleteDraftPurchase: (id: string) => void;
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
  editReturnedItems: (itemId: string, returns: ReturnItemSchemaType[]) => void;

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
      draftPurchases: [],
      currentDraftId: null,

      setCurrentDraftId: (id) => {
        set({ currentDraftId: id });
      },
      upserDraftPurchase: (draft) => {
        const currentDraftId = get().currentDraftId;
        draft.isCurrent = false;
        console.log("CURRENT DRAFT ID: ", currentDraftId);

        const existing = get().draftPurchases.find(
          (d) => d.draft_purchase_id === currentDraftId
        );

        console.log("IS EXISITNG? : ", existing);

        if (existing && currentDraftId) {
          console.log("THIS IS AN UPDATE");
          // update
          const others = get().draftPurchases.filter(
            (d) => d.draft_purchase_id !== currentDraftId
          );
          const existingDraft = draft as DraftPurchase;
          existingDraft.isCurrent = true;
          existingDraft.draft_purchase_id = currentDraftId;

          set({ draftPurchases: [...others, existingDraft] });
        } else {
          // add
          const id = new Date().toISOString();
          const isCurrent = true;

          set({ currentDraftId: id });
          console.log("SETTING CURRENT DRAFT ID: ", id);
          const draftWithId: DraftPurchase = {
            ...draft,
            draft_purchase_id: id,
            isCurrent,
          };

          set((state) => ({
            draftPurchases: [...state.draftPurchases, draftWithId],
          }));
        }
      },

      isFormValid: (addErrors = true) => {
        const { formValues } = get();
        const schema = apiValidations.AddPurchaseSchema;
        const validation = schema.safeParse(formValues);

        if (!validation.success) {
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
      populateDraftPurchase: (draftId) => {
        const draft = get().draftPurchases.find(
          (d) => d.draft_purchase_id === draftId
        );

        if (draft) {
          set({ formValues: draft });
          set({ currentDraftId: draftId });
        }
      },
      deleteDraftPurchase: (id) => {
        set((state) => {
          const others = state.draftPurchases.filter(
            (d) => d.draft_purchase_id !== id
          );
          const isCurrent = state.currentDraftId === id;
          if (isCurrent) {
            set({ currentDraftId: null });
          }
          return { draftPurchases: others };
        });
      },
      populatePurchase: (purchase, usdRate) => {
        // Map API Purchase → FormValues
        const mappedItems: PurchaseItem[] = purchase.items.map((i) => ({
          itemId: i.itemId,
          name: i.name,
          returns: i.returns,
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

      editReturnedItems: (itemId, returns) => {
        //here we should update the returns of the item and recalc the total price
        const item = get().formValues.items.find((i) => i.itemId === itemId);
        if (!item) return;
        const totalQuantityReturned = returns.reduce(
          (sum, ret) => sum + ret.quantityReturned,
          0
        );
        set((state) => ({
          formValues: {
            ...state.formValues,
            items: state.formValues.items.map((i) =>
              i.itemId === itemId
                ? {
                    ...i,
                    returns,
                    totalPrice:
                      i.quantity * (i.quantity - totalQuantityReturned),
                  }
                : i
            ),
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
        set({
          formValues: initialFormValues,
          editingPurchase: null,
        });
      },
    }),
    {
      name: "Car Components Purchase Storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
