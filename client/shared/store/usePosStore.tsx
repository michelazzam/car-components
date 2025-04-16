import { Invoice } from "@/api-hooks/invoices/useListInvoices";
import { create } from "zustand";

export interface Item {
  type?: "product" | "service";
  name?: string;
  quantity?: number;
  price?: number;
  amount?: number;
  brand?: string;
  productId?: string;
  _id?: string;
  product?: {
    _id: string;
    name: string;
    price: number;
  };
  stock?: number;
}

interface Discount {
  amount: number;
  type: "percentage" | "fixed";
}

interface PosState {
  cart: Item[];
  vatAmount: number;
  setVatAmount: (vatAmount: number) => void;
  discountStore: Discount;
  applyDiscount: (amount: number, type: "percentage" | "fixed") => Discount;
  payLater: boolean;
  setPayLater: (isPaid: boolean) => void;
  cartSum: () => number;
  // setCart: (type: "product" | "service", item: Item, edit?: boolean) => void;
  clearCart: () => void;
  clearPosStore: () => void;
  editingInvoice?: Invoice;
  setEditingInvoice: (invoice?: Invoice) => void;
  addToCart: (type: "product" | "service", item: Item) => void;
  addGroupItem: (type: "product" | "service", items: Item[]) => void;
  removeItem: (item: Item) => void;
  totalAmount: () => number;
  setQuantity: (name: string, price: number, quantity: number) => void;
}

interface EditingInvoice {
  finalPriceUsd: number;
  discount: Discount;
  _id: string;
  customer: {
    _id: string;
    name: string;
    loan: number;
    loanLbp: number;
    phoneNumber?: string;
    address?: string;
  };
  driverName: string;
  generalNote: string;
  customerNote: string;
  isPaid: boolean;
  totalPriceUsd: number;
  totalPriceLbp: number;
  amountPaidUsd: number;
  amountPaidLbp: number;
  taxesLbp: number;
  createdBy: {
    _id: string;
    fullName: string;
    username: string;
  };
  vehicle: {
    _id: string;
    vehicleNb: string;
    model: string;
  };
  products: {
    product: {
      _id: string;
      name: string;
      price: number;
      stock?: number;
    };
    quantity: number;
  }[];
  services: {
    name: string;
    quantity: number;
    price: number;
  }[];

  createdAt: string;
  updatedAt: string;
  invoiceNumber: number;
  __v: number;
}

// function updateArray(originalArray: Item[], newItem: Item): Item[] {
//   let index = null;
//   index = originalArray.findIndex((item) => item.name === newItem.name);
//   if (index !== -1) {
//     // Item already exists, remove it
//     return [
//       ...originalArray.slice(0, index),
//       ...originalArray.slice(index + 1),
//     ];
//   } else {
//     // Item doesn't exist, add it
//     return [...originalArray, newItem];
//   }
// }

export const usePosStore = create<PosState>()((set, get) => ({
  //-----\
  cart: [],
  vatAmount: 0,
  discountStore: { amount: 0, type: "fixed" },
  payLater: false,
  editingInvoice: undefined,

  // Setters
  setVatAmount: (vatAmount: number) => set({ vatAmount }),
  setPayLater: (payLater: boolean) => set({ payLater }),
  setEditingInvoice: (invoice?: Invoice | EditingInvoice) => {
    set({ editingInvoice: invoice as EditingInvoice });
  },

  // Apply discount logic
  applyDiscount: (amount: number, type: "fixed" | "percentage"): Discount => {
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
  // setCart: (type: "product" | "service", item: Item, edit = false) => {
  //   set((state) => {
  //     let newItem: Item = {
  //       type,
  //       name: item.name,
  //       quantity: edit ? item.quantity : 1,
  //       price: item.price,
  //       amount: Number(item.price) * (edit ? Number(item.quantity) : 1),
  //     };

  //     if (type === "product") {
  //       newItem.brand = item.brand;
  //       newItem.productId = item._id;
  //     }
  //     return {
  //       ...state,
  //       cart: updateArray(state.cart, newItem),
  //     };
  //   });
  // },
  addToCart: (type: "product" | "service", item: Item) => {
    const newItem: Item = {
      type,
      name: item.name,
      price: item.price,
      quantity: type === "product" ? 1 : item.quantity,
      amount:
        Number(item.price) * (type === "product" ? 1 : Number(item.quantity)),
      productId: item._id || "",
      stock: item.stock || 0,
    };

    set((state) => ({
      cart: [...state.cart, newItem],
    }));
  },

  addGroupItem: (type: "product" | "service", items: Item[]) => {
    if (items) {
      const itemsToAdd = items.map((element) => ({
        type,
        name:
          type === "service"
            ? element.name
            : element.product && element.product.name,
        price:
          type === "service"
            ? element.price
            : element.product && element.product.price,
        quantity: element.quantity,
        amount:
          type === "service"
            ? element.price && element.quantity
              ? element.price * element.quantity
              : 0
            : element.product && element.product.price && element.quantity
            ? element.product.price * element.quantity
            : 0,
        productId:
          type === "product"
            ? element.product && element.product._id
            : undefined,
        stock: element.stock || 0,
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

  totalAmount: () => {
    const { cart, vatAmount, discountStore } = get();

    let totalItemsAmount = Number(
      cart.reduce((total: number, item: Item) => total + Number(item.amount), 0)
    );

    // Ensure vatAmount and discountStore.amount are valid numbers
    const validVatAmount = Number(vatAmount) || 0;
    const discountAmount = Number(discountStore.amount) || 0;

    if (discountStore.type === "percentage") {
      const discountValue = totalItemsAmount * (discountAmount * 0.01);
      let totalItemsAmountWithDiscount = Number(
        totalItemsAmount - discountValue
      );
      return parseFloat(
        (totalItemsAmountWithDiscount + validVatAmount).toFixed(2)
      );
    } else {
      let totalItemsAmountWithDiscount = Number(
        totalItemsAmount - discountAmount
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
            ? { ...item, quantity, amount: item.price * quantity }
            : item
        ),
      };
    });
  },

  clearCart: () =>
    set({
      cart: [],
    }),

  clearPosStore: () =>
    set({
      cart: [],
      editingInvoice: undefined,
      vatAmount: 0,
      payLater: false,
      discountStore: { amount: 0, type: "fixed" },
    }),
}));

export const clearPosStore = () => {
  usePosStore.setState({
    cart: [],
    editingInvoice: undefined,
    vatAmount: 0,
    payLater: false,
    discountStore: { amount: 0, type: "fixed" },
  });
};
