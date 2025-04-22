import { Supplier } from "../supplier/use-list-supplier";

export type Purchase = {
  _id: string;
  supplier: Supplier;
  invoiceDate: string;
  invoiceNumber: string;
  customerConsultant: string;
  phoneNumber: string;
  vatPercent: number;
  vatLBP: number;
  totalAmount: number;
  amountPaid: number;
  items: [
    {
      itemId: string;
      description: string;
      price: number;
      quantity: number;
      quantityFree: number;
      discount: number;
      lotNumber: string;
      expDate: string;
      totalPrice: number;
    }
  ];
};
