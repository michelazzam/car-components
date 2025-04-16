import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import Customer, { ICustomer } from "./customer.model.js";
import Invoice from "../invoice/invoice.model.js";
import Accounting, { accountingId } from "../accounting/accounting.model.js";
import Report from "../report/report.model.js";
import { formatISODate } from "../../utils/formatIsoDate.js";

/**
 * Get all customers
 */
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const { pageIndex, search, pageSize } = req.query;

    // const pageSize = 25;
    const filter: FilterQuery<ICustomer> = {};

    // Add search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [customers, totalCount] = await Promise.all([
      Customer.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(pageIndex) || 0) * Number(pageSize))
        .limit(Number(pageSize)),
      Customer.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / Number(pageSize));

    res.json({ customers, pageIndex, pageSize, totalCount, totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Create a new customer
 */
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, address, tvaNumber, note } = req.body;

    // if there is tvaNumber, make sure it's unique
    if (tvaNumber) {
      const existingCustomer = await Customer.findOne({ tvaNumber });
      if (existingCustomer) {
        return res
          .status(400)
          .json({ message: "Customer with this tva number already exists" });
      }
    }

    const newCustomer = new Customer({
      name,
      phone,
      email,
      address,
      tvaNumber,
      note,
    });
    await newCustomer.save();

    res.status(201).json({
      message: "Customer saved successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Customer with this phone already exists" });
    }

    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Update a single customer by Id
 */
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    const { name, phone, email, address, tvaNumber, note } = req.body;

    // if there is tvaNumber, make sure it's unique
    if (tvaNumber) {
      const existingCustomer = await Customer.findOne({
        _id: { $ne: customerId },
        tvaNumber,
      });
      if (existingCustomer) {
        return res
          .status(400)
          .json({ message: "Customer with this tva number already exists" });
      }
    }

    // update customer
    await Customer.findByIdAndUpdate(customerId, {
      name,
      phone,
      email,
      address,
      tvaNumber,
      note,
    });

    res.json({ message: "Customer updated successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Customer with this phone already exists" });
    }

    res.status(500).json({ message: "Server error", error });
  }
};

/**
 *
 * @desc Delete a customer by ID
 */
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    // cannot delete customer with invoices
    const invoice = await Invoice.findOne({ customer: customerId });
    if (invoice) {
      return res
        .status(400)
        .json({ message: "Cannot delete customer with invoices" });
    }

    // cannot delete customer with vehicles
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (customer.totalVehicles > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete customer with vehicles" });
    }

    // delete Customer
    await Customer.findByIdAndDelete(customerId);

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 *
 * @desc Pay customer unpaid invoice
 */
export const payCustomerUnpaidInvoice = async (req: Request, res: Response) => {
  try {
    const { invoiceId } = req.params;

    const { amountPaidUsd, amountPaidLbp } = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // sum amountPaidUsd and amountPaidLbp(after converting to usd)
    const accounting = await Accounting.findById(accountingId);
    const amountPaidLbpConvertedToUsd = amountPaidLbp * accounting!.usdRate;
    const totalAmountPaidUsd = Number(
      (amountPaidUsd + amountPaidLbpConvertedToUsd).toFixed(2)
    );

    //1 pay the invoice (increase paid amounts + mark it paid)
    await Invoice.findByIdAndUpdate(invoiceId, {
      $inc: {
        totalPaidUsd: totalAmountPaidUsd,
        amountPaidUsd,
        amountPaidLbp,
      },
      $set: {
        isPaid: true,
      },
    });

    //2 decrease customer loan (the remaining invoice amount)
    await Customer.findByIdAndUpdate(invoice.customer, {
      $inc: { loan: -invoice.remainingAmountUsd },
    });

    // increase total income (USD & LBP)
    await Accounting.findByIdAndUpdate(accountingId, {
      $inc: {
        totalIncome: totalAmountPaidUsd,
      },
    });

    // increase date income in report
    await Report.findOneAndUpdate(
      { date: formatISODate(new Date()) },
      {
        $inc: {
          totalIncome: totalAmountPaidUsd,
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Customer invoice paid successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
