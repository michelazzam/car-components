import { Purchase } from "@/api-hooks/purchase/use-list-purchase";
import { AddPurchaseItemSchemaType as ProductT } from "@/lib/apiValidations";
import create, { StoreApi } from "zustand";

//
// Types
//

// Generic option type for select inputs
export interface Option<T = string> {
  value: T;
  label: string;
}

interface Supplier {
  value: string;
  label: string;
}

export interface InvoiceDetails {
  invoiceNumber: string | null;
  invoiceDate: string | null;
  supplier: Option<string> | null;
  customer: Option<string> | null;
  salesOrder: Option<string> | null;
  phoneNumber: string | null;
}

export interface Payment {
  amount: number;
  amountLbp?: number;
  note?: string;
}

export interface Totals {
  totalAmount: number;
  totalAmountPaid: number;
  totalAmountPaidLbp: number;
  totalAmountDue: number;
}

export interface PurchaseState {
  invoiceDetails: InvoiceDetails;
  payment: Payment;
  addingProduct: ProductT | null;
  products: ProductT[];
  tva: number;
  lebaneseTva: number;
  usdRate: number;
  editingPurchase: Purchase | null;
  totals: Totals;

  // Actions
  setUsdRate: (newUsdRate: number) => void;
  addProduct: (product: ProductT) => void;
  setAddingProduct: (product: ProductT) => void;

  setTVA: (newTVA: number) => void;
  setLebaneseTva: (newTVA: number) => void;
  setSupplier: (supplier: Option<string>) => void;
  deleteProduct: (_id: string) => void;
  addPayment: (
    payment: Payment,
    onError?: () => void,
    onSuccess?: () => void
  ) => void;
  setEditingPurchase: (purchase: Purchase) => void;
  clearPurchase: () => void;
}

//
// Utility functions
//

function calculateTotals(products: ProductT[], payment: Payment): Totals {
  const totalAmount = products.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalAmountPaid = payment.amount;
  const totalAmountPaidLbp = payment.amountLbp || 0;
  const totalAmountDue = totalAmount - totalAmountPaid;

  return {
    totalAmount,
    totalAmountPaid,
    totalAmountPaidLbp,
    totalAmountDue,
  };
}

function handleSetSupplier(
  set: StoreApi<PurchaseState>["setState"],
  supplier: Supplier
): void {
  set((state) => ({
    invoiceDetails: {
      ...state.invoiceDetails,
      supplier: {
        value: supplier.value,
        label: supplier.label,
      },
    },
  }));
}

//
// Zustand store
//

export const usePurchase = create<PurchaseState>((set, get) => ({
  // Initial state
  invoiceDetails: {
    invoiceNumber: null,
    invoiceDate: null,
    supplier: null,
    customer: null,
    salesOrder: null,
    phoneNumber: null,
  },
  payment: {
    amount: 0,
    amountLbp: 0,
    note: "",
  },
  addingProduct: null,
  products: [],
  tva: 11,
  lebaneseTva: 0,
  usdRate: 0,
  editingPurchase: null,
  totals: {
    totalAmount: 0,
    totalAmountPaid: 0,
    totalAmountPaidLbp: 0,
    totalAmountDue: 0,
  },

  // Action implementations
  setUsdRate: (newUsdRate) => set({ usdRate: newUsdRate }),

  addProduct: (product) => {
    const products = [...get().products, product];
    set({
      products,
      totals: calculateTotals(products, get().payment),
    });
  },

  setAddingProduct: (product) => {
    set({ addingProduct: product });
    if (product.supplier) {
      handleSetSupplier(set, product.supplier);
    }
  },

  setTVA: (newTVA) => set({ tva: newTVA }),

  setLebaneseTva: (newTVA) => set({ lebaneseTva: newTVA }),

  setSupplier: (supplier) => {
    set({
      invoiceDetails: {
        ...get().invoiceDetails,
        supplier,
      },
    });
  },

  deleteProduct: (_id) => {
    const products = get().products.filter((product) => product.itemId !== _id);
    set({
      products,
      totals: calculateTotals(products, get().payment),
    });
  },

  addPayment: (payment, onSuccess) => {
    set({
      payment: payment,
      totals: calculateTotals(get().products, payment),
    });
    onSuccess?.();
  },

  setEditingPurchase: (purchase) => {
    get().clearPurchase();
    if (!purchase) return;

    set({ editingPurchase: purchase });

    if (purchase.supplier) {
      handleSetSupplier(set, {
        value: purchase.supplier._id || "",
        label: purchase.supplier.name,
      });
    }

    if (purchase.items) {
      const formatted = purchase.items.map((item) => ({
        ...item,
        product: {
          value: item.itemId,
          label: item.description,
        },
      }));
      //@ts-ignore
      set({ products: formatted });
    }

    // if (purchase.expense) {
    //   set({ payment: purchase.expense });
    // }

    set({
      totals: calculateTotals(get().products, get().payment),
      tva: purchase.vatPercent ?? get().tva,
      lebaneseTva: purchase.vatLBP ?? get().lebaneseTva,
    });
  },

  clearPurchase: () => {
    set({
      invoiceDetails: {
        invoiceNumber: null,
        invoiceDate: null,
        supplier: null,
        customer: null,
        salesOrder: null,
        phoneNumber: null,
      },
      addingProduct: null,
      products: [],
      tva: 11,
      lebaneseTva: 0,
      payment: {
        amount: 0,
        amountLbp: 0,
        note: "",
      },
      editingPurchase: null,
      totals: {
        totalAmount: 0,
        totalAmountPaid: 0,
        totalAmountPaidLbp: 0,
        totalAmountDue: 0,
      },
    });
  },
}));

export const clearPurchase = (): void => {
  usePurchase.getState().clearPurchase();
};
