import { body } from "express-validator";
import { DiscountType } from "./invoice.model.js";

export const createEditInvoiceValidators = [
  body("customerId").isMongoId().withMessage("customerId is not a valid ID"),
  body("amountPaidUsd")
    .isNumeric()
    .withMessage("amountPaidUsd is required & numeric"),
  body("amountPaidLbp")
    .isNumeric()
    .withMessage("amountPaidLbp is required & numeric"),
  body("discount")
    .optional()
    .custom((discount) => {
      if (discount) {
        if (discount.type !== "percentage" && discount.type !== "fixed") {
          throw new Error("Discount type must be either percentage or fixed");
        }
        if (discount.amount < 0) {
          throw new Error("Discount amount must be a positive number");
        }
      }
      return true;
    }),
  body("isPaid").isBoolean().withMessage("isPaid is required"),
  body("products").isArray(),
  body("products.*.productId")
    .isMongoId()
    .withMessage("Each product must be a valid ID."),
  body("products.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer."),
  body("services").isArray(),
  body("services.*.name").isString().withMessage("service name is required"),
  body("services.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer."),
  body("services.*.price")
    .isInt({ min: 1 })
    .withMessage("price must be a positive integer."),
];

export interface CreateEditInvoiceFields {
  invoiceNumber: number;
  driverName: string;
  customerId: string;
  generalNote: string;
  customerNote: string;
  amountPaidUsd: number;
  amountPaidLbp: number;
  discount?: {
    amount: number;
    type: DiscountType;
  };
  isPaid: boolean;
  vehicleId: string;
  products: Array<{
    productId: string;
    quantity: number;
  }>;
  services: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}
