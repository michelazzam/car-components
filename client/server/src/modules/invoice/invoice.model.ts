import mongoose from "mongoose";
import { COUNTERID } from "./invoice.controller.js";

export const discountTypes = ["percentage", "fixed"] as const;
export type DiscountType = (typeof discountTypes)[number];

export interface IInvoice extends mongoose.Document {
  invoiceNumber: number;
  driverName: string;
  discount: {
    amount: number;
    type: DiscountType;
  };
  customer: mongoose.Schema.Types.ObjectId;
  generalNote: string;
  customerNote: string;
  isPaid: boolean;
  usdRate: number;
  totalPriceLbp: number;
  totalPriceUsd: number;
  amountPaidUsd: number;
  amountPaidLbp: number;
  taxesLbp: number;
  finalPriceUsd: number;
  remainingAmountUsd: number;
  totalPaidUsd: number;
  createdBy: mongoose.Schema.Types.ObjectId;
  vehicle?: mongoose.Schema.Types.ObjectId;
  products: {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];
  services: {
    name: string;
    quantity: number;
    price: number;
  }[];
  createdAt: Date;
}

const InvoiceProductSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const InvoiceServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const InvoiceSchema = new mongoose.Schema<IInvoice>(
  {
    invoiceNumber: {
      type: Number,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    driverName: {
      type: String,
    },
    generalNote: {
      type: String,
    },
    customerNote: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    usdRate: {
      type: Number,
      // required: true,
    },
    totalPriceLbp: {
      type: Number,
      // required: true,
    },
    totalPriceUsd: {
      type: Number,
      required: true,
    },
    totalPaidUsd: {
      type: Number,
    },
    amountPaidUsd: {
      type: Number,
      required: true,
    },
    amountPaidLbp: {
      type: Number,
      required: true,
    },
    taxesLbp: {
      type: Number,
    },
    finalPriceUsd: {
      type: Number,
    },
    remainingAmountUsd: {
      type: Number,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    discount: {
      amount: {
        type: Number,
        default: 0,
      },
      type: {
        type: String,
        enum: discountTypes,
        default: "percentage",
      },
    },
    products: [InvoiceProductSchema],
    services: [InvoiceServiceSchema],
  },
  {
    timestamps: true,
  }
);

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
  availableSequences: {
    type: [Number],
    default: [],
  },
});

export const InvoiceCounter = mongoose.model("Counter", CounterSchema);

// on create invoice
InvoiceSchema.pre("save", async function (next) {
  const doc = this as unknown as IInvoice;

  if (!doc.invoiceNumber) {
    try {
      // Check if a counter exists for the current year

      const counter = await InvoiceCounter.findById(COUNTERID);

      if (!counter) {
        const currentYear = new Date().getFullYear();

        const yearPrefix = Number(String(currentYear).slice(-2)); // Get last two digits of the year

        const initialSequence = yearPrefix * 1000; // Base sequence for the year (e.g., 24000 for 2024)

        // Create a new counter record for the year
        const newCounter = new InvoiceCounter({
          _id: COUNTERID,
          seq: initialSequence, // Start the sequence at year-specific base
          availableSequences: [],
        });
        await newCounter.save();
        doc.invoiceNumber = initialSequence; // First invoice number for the year
      } else {
        if (counter.availableSequences.length > 0) {
          // Use the first available sequence if present
          doc.invoiceNumber = counter.availableSequences.shift()!; // Remove and use the smallest available sequence
          await counter.save(); // Save changes to update the array
        } else {
          // Increment `seq` and assign it as the invoice number if no available sequence
          const updatedCounter = await InvoiceCounter.findByIdAndUpdate(
            COUNTERID,
            { $inc: { seq: 1 } },
            { new: true }
          );

          if (updatedCounter && updatedCounter.seq) {
            doc.invoiceNumber = updatedCounter.seq;
          } else {
            throw new Error("Failed to generate invoice number");
          }
        }
      }

      next();
    } catch (error) {
      console.error("Error generating invoice number:", error);
      next(error);
    }
  } else {
    next();
  }
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);
export default Invoice;
