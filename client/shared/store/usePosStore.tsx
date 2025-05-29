import { GetItem, Invoice, Swap } from "@/api-hooks/invoices/useListInvoices";
import { AddInvoiceSchema } from "@/lib/apiValidations";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

function calculateDiscountedAmount(
  price: number,
  quantity: number,
  discount?: Discount
): number {
  const total = price * quantity;
  if (discount) {
    if (discount.type === "percentage") {
      return Number((total - (total * discount.amount) / 100).toFixed(2));
    } else {
      return Number((total - discount.amount).toFixed(2));
    }
  } else {
    return total;
  }
}

export type DraftInvoice = AddInvoiceSchema & {
  draft_invoice_id: string;
  isCurrent: boolean;
};

export interface Item {
  type?: "product" | "service";
  name?: string;
  quantity?: number;
  price?: number;
  amount?: number;
  brand?: string;
  cost: number;
  productId?: string;
  _id?: string;
  product?: {
    _id: string;
    name: string;
    price: number;
  };
  stock?: number;
  discount?: Discount;
}

export interface Discount {
  amount: number;
  type: "percentage" | "fixed";
}

interface PosState {
  cart: Item[];
  vatAmount: number;
  setVatAmount: (vatAmount: number) => void;
  swaps: Swap[];
  setSwaps: (swaps: Swap[]) => void;
  discountStore: Discount;
  applyDiscount: (amount: number, type: "percentage" | "fixed") => Discount;
  payLater: boolean;
  setPayLater: (isPaid: boolean) => void;
  cartSum: () => number;
  // setCart: (type: "product" | "service", item: Item, edit?: boolean) => void;
  clearCart: () => void;
  clearPosStore: () => void;
  editingInvoice?: Invoice;
  draftInvoices: DraftInvoice[];
  hasReadDraftInvoices: boolean;
  setHasReadDraftInvoices: (hasReadDraftInvoices: boolean) => void;
  deleteDraftInvoice: (id: string) => void;
  deleteCurrentDraftInvoice: () => void;
  getCurrentDraftInvoice: () => DraftInvoice | undefined;
  upsertDraftInvoice: (draft: DraftInvoice) => void;
  setEditingInvoice: (invoice?: Invoice) => void;
  addToCart: (type: "product" | "service", item: Item) => void;
  addGroupItem: (type: "product" | "service", items: GetItem[]) => void;
  removeItem: (item: Item) => void;
  totalAmount: (isVatActive: boolean) => number;
  setQuantity: (name: string, price: number, quantity: number) => void;
  addItemDiscount: (prodcutId: string, discount: Discount) => void;
  changeItemPrice: (prodcutId: string, price: number) => void;
}

export const usePosStore = create<PosState>()(
  persist(
    (set, get) => ({
      //-----\
      cart: [],
      vatAmount: 0,
      hasReadDraftInvoices: true,
      discountStore: { amount: 0, type: "fixed" },
      payLater: false,
      editingInvoice: undefined,
      swaps: [],
      draftInvoices: [],
      // Setters
      setSwaps: (swaps: Swap[]) => set({ swaps }),
      setVatAmount: (vatAmount: number) => set({ vatAmount }),
      setPayLater: (payLater: boolean) => set({ payLater }),
      setEditingInvoice: (invoice?: Invoice) => {
        set({ editingInvoice: invoice as Invoice });
      },
      setHasReadDraftInvoices: (hasReadDraftInvoices: boolean) =>
        set({ hasReadDraftInvoices }),
      deleteDraftInvoice: (id: string) => {
        set((state) => {
          const others = state.draftInvoices.filter(
            (d) => d.draft_invoice_id !== id
          );
          return { draftInvoices: others };
        });
      },
      deleteCurrentDraftInvoice: () => {
        set((state) => {
          const others = state.draftInvoices.filter(
            (d) => d.isCurrent === false
          );
          return { draftInvoices: others };
        });
      },

      getCurrentDraftInvoice: () => {
        return get().draftInvoices.find((d) => d.isCurrent);
      },

      upsertDraftInvoice: (draft: DraftInvoice) => {
        set((state) => {
          const existing = state.draftInvoices.find(
            (d) => d.draft_invoice_id === draft.draft_invoice_id
          );
          // mark others false
          const others = state.draftInvoices.map((d) => ({
            ...d,
            isCurrent: false,
          }));
          let updated: DraftInvoice[];
          let hasReadDraftInvoices = state.hasReadDraftInvoices;
          if (existing) {
            updated = others.map((d) =>
              d.draft_invoice_id === draft.draft_invoice_id
                ? { ...draft, isCurrent: true }
                : d
            );
          } else {
            //make the status of has read = false
            hasReadDraftInvoices = false;
            console.log("SETTING HAS READ TO FALSE");
            updated = [...others, { ...draft, isCurrent: true }];
          }
          return { draftInvoices: updated, hasReadDraftInvoices };
        });
      },
      // Apply discount logic
      applyDiscount: (
        amount: number,
        type: "fixed" | "percentage"
      ): Discount => {
        const discount = { amount, type };
        set((state) => ({
          ...state,
          discountStore: discount,
        }));
        return discount;
      },
      //Cart Management
      cartSum: () => {
        return get().cart.reduce((acc, item) => acc + Number(item.amount), 0);
      },

      addToCart: (type: "product" | "service", item: Item) => {
        const newItem: Item = {
          type,
          cost: item.cost,
          name: item.name,
          price: item.price,
          quantity: type === "product" ? 1 : item.quantity,
          amount:
            Number(item.price) *
            (type === "product" ? 1 : Number(item.quantity)),
          productId: item._id || "",
          stock: item.quantity || 0,
        };

        set((state) => ({
          cart: [...state.cart, newItem],
        }));
      },

      addGroupItem: (type: "product" | "service", items: GetItem[]) => {
        if (items) {
          const itemsToAdd = items.map((element) => ({
            type,
            name: element.name,
            price: element.price,
            quantity: element.quantity,
            cost: element?.cost || 0,
            amount: element.discount
              ? element.price * element.quantity -
                (element.discount.type === "percentage"
                  ? element.price *
                    element.quantity *
                    (element.discount.amount * 0.01)
                  : element.discount.amount)
              : element.price * element.quantity,
            discount: element.discount,
            productId:
              type === "product" ? element.itemRef : element.serviceRef,
          }));
          set((state) => ({
            cart: [...state.cart, ...itemsToAdd],
          }));
        }
      },

      removeItem: (item: Item) => {
        set((state) => ({
          cart: state.cart.filter(
            (element) =>
              !(element.name === item.name && element.price === item.price)
          ),
        }));
      },

      totalAmount: (isVatActive: boolean) => {
        const { cart, vatAmount, discountStore, swaps } = get();

        let totalItemsAmount = Number(
          cart.reduce(
            (total: number, item: Item) => total + Number(item.amount),
            0
          )
        );

        // Ensure vatAmount and discountStore.amount are valid numbers
        const validVatAmount = isVatActive ? Number(vatAmount) || 0 : 0;
        const discountAmount = Number(discountStore.amount) || 0;
        const swapsDiscount = swaps.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        if (discountStore.type === "percentage") {
          const discountValue = totalItemsAmount * (discountAmount * 0.01);
          let totalItemsAmountWithDiscount = Number(
            totalItemsAmount - discountValue - swapsDiscount
          );
          return parseFloat(
            (totalItemsAmountWithDiscount + validVatAmount).toFixed(2)
          );
        } else {
          let totalItemsAmountWithDiscount = Number(
            totalItemsAmount - discountAmount - swapsDiscount
          );
          return parseFloat(
            (totalItemsAmountWithDiscount + validVatAmount).toFixed(2)
          );
        }
      },

      setQuantity: (name: string, price: number, quantity: number) => {
        set((state) => {
          return {
            ...state,
            cart: state.cart.map((item: Item) =>
              item.name === name && item.price === price
                ? {
                    ...item,
                    quantity,
                    amount: calculateDiscountedAmount(
                      item.price,
                      quantity,
                      item.discount
                    ),
                  }
                : item
            ),
          };
        });
      },

      addItemDiscount: (productId: string, discount: Discount) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  discount,
                  amount: calculateDiscountedAmount(
                    item.price!,
                    item.quantity!,
                    discount
                  ),
                }
              : item
          ),
        }));
      },
      changeItemPrice: (productId: string, price: number) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  price: price,
                  amount: calculateDiscountedAmount(
                    price,
                    item.quantity!,
                    item.discount
                  ),
                }
              : item
          ),
        }));
      },

      clearCart: () =>
        set({
          cart: [],
        }),

      clearPosStore: () =>
        set({
          cart: [],
          swaps: [],
          editingInvoice: undefined,
          vatAmount: 0,
          payLater: false,
          discountStore: { amount: 0, type: "fixed" },
        }),
    }),
    {
      name: "Invoice Storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export const clearPosStore = () => {
  console.log("CLEARING POS STORE...");
  usePosStore.setState({
    cart: [],
    swaps: [],
    editingInvoice: undefined,
    vatAmount: 0,
    payLater: false,
    discountStore: { amount: 0, type: "fixed" },
  });
};
