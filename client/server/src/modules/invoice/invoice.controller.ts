import { Request, Response } from "express";
import Invoice, { IInvoice, InvoiceCounter } from "./invoice.model.js";
import { CreateEditInvoiceFields } from "./invoice.validation.js";
import Product, { IProduct } from "../product/product.model.js";
import { getAuthUserData } from "../user/utils/get-auth-user-data.js";
import mongoose, { FilterQuery } from "mongoose";
import Vehicle from "../vehicle/vehicle.model.js";
import Customer from "../customer/customer.model.js";
import Accounting, { accountingId } from "../accounting/accounting.model.js";
import Organization, {
  organizationId,
} from "../organization/organization.model.js";
import Report from "../report/report.model.js";
import { formatISODate } from "../../utils/formatIsoDate.js";

const MAX_INVOICE_NUMBER_ALLOWED_TO_BE_ENTERED = 24157;

export const COUNTERID = `invoiceNumber-${new Date().getFullYear()}`; // Dynamic ID with year

/**
 * Get all invoices
 */
export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const {
      search,
      pageIndex,
      pageSize,
      startDate,
      endDate,
      customerId,
      vehicleId,
      isPaid,
    } = req.query;

    const limit = Number(pageSize) || 30;
    const skip = (pageIndex ? Number(pageIndex) : 0) * limit;

    let matchQuery: FilterQuery<IInvoice> = {};

    // Add search functionality
    if (search) {
      matchQuery.$or = [
        { driverName: { $regex: search, $options: "i" } },
        { customerNote: { $regex: search, $options: "i" } },
        { generalNote: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "vehicle.vehicleNb": { $regex: search, $options: "i" } },
      ];
    }

    //in case the search is a number, convert it to string + remove the tb from it
    const invoiceQuery = search
      ?.toString()
      .trim()
      .replace("tb", "")
      .replace("TB", "");
    if (invoiceQuery && !isNaN(Number(invoiceQuery))) {
      matchQuery.$or?.push({
        invoiceNumber: { $eq: parseInt(invoiceQuery) },
      });
    }

    // Add date range filter if provided
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);

      matchQuery.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    // Add isPaid filter if provided
    if (isPaid !== undefined) {
      matchQuery.isPaid = isPaid === "true";
    }

    const invoices = await Invoice.aggregate([
      // join with vehicle and customer
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicle",
          foreignField: "_id",
          as: "vehicle",
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      // Replace product with product details and retain quantity
      {
        $addFields: {
          products: {
            $map: {
              input: "$products",
              as: "prod",
              in: {
                quantity: "$$prod.quantity",
                product: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$productDetails",
                        as: "detail",
                        cond: { $eq: ["$$detail._id", "$$prod.product"] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },

      // convert the arrays to objects
      {
        $addFields: {
          vehicle: {
            $first: "$vehicle",
          },
        },
      },
      {
        $addFields: {
          customer: {
            $first: "$customer",
          },
        },
      },

      // filter by customer._id after lookup
      ...(customerId
        ? [
            {
              $match: {
                "customer._id": new mongoose.Types.ObjectId(
                  customerId as string
                ),
              },
            },
          ]
        : []),

      // filter by vehicle._id after lookup
      ...(vehicleId
        ? [
            {
              $match: {
                "vehicle._id": new mongoose.Types.ObjectId(vehicleId as string),
              },
            },
          ]
        : []),

      // filter other conditions
      {
        $match: matchQuery,
      },

      {
        $sort: { createdAt: -1 },
      },

      // paginate
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    // Add customerId filter to matchQuery for countDocuments only
    let countQuery = { ...matchQuery };
    if (customerId) {
      countQuery.customer = new mongoose.Types.ObjectId(customerId as string);
    }
    if (vehicleId) {
      countQuery.vehicle = new mongoose.Types.ObjectId(vehicleId as string);
    }

    const totalCount = await Invoice.countDocuments(countQuery);

    return res.json({
      invoices,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      pageIndex: Number(pageIndex),
      pageSize: limit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Server error", error });
  }
};
/**
 * Create a new invoice
 */
export const createInvoice = async (req: Request, res: Response) => {
  try {
    const {
      invoiceNumber,
      driverName,
      discount,
      customerId,
      isPaid,
      vehicleId,
      services,
      products,
      generalNote,
      customerNote,
      amountPaidUsd,
      amountPaidLbp,
    }: CreateEditInvoiceFields = req.body;

    // get usd rate & vat % to be used in calculations below
    const accounting = await Accounting.findById(accountingId);
    const organizationInfo = await Organization.findById(organizationId);

    // validate products stock
    const productsDB = await Product.find({
      _id: { $in: products.map((prod) => prod.productId) },
    });
    validateProductsStock(products, productsDB);

    // ---------- Finance stuff ----------

    // compute total price
    const totalPriceUsd = computeTotalPrice(products, productsDB, services);

    // compute discount amount
    let discountAmountUsd = 0;
    if (discount?.amount) {
      if (discount.type === "percentage")
        discountAmountUsd = 1 - discount.amount / 100;
      else discountAmountUsd = discount.amount;
    }

    // compute taxes (lbp)
    // Note: taxes are calculated after discount
    const taxesUsd =
      ((totalPriceUsd - discountAmountUsd) *
        Number(organizationInfo!.tvaPercentage)) /
      100;
    const taxesLbp = taxesUsd * accounting!.usdRate;

    const totalPriceLbp = totalPriceUsd * accounting!.usdRate;
    // calc final price after discount + taxes
    const finalPriceUsd = totalPriceUsd - discountAmountUsd + taxesUsd;

    const amountPaidLbpConvertedToUsd = Number(
      (amountPaidLbp / accounting!.usdRate).toFixed(2)
    );
    const totalAmountPaidUsd = amountPaidUsd + amountPaidLbpConvertedToUsd;
    const remainingAmountUsd = finalPriceUsd - totalAmountPaidUsd;

    // if invoiceNumber is passed in the request body, use it if does not violate unique constraint(unique & between 0 and the Max)
    if (invoiceNumber) {
      if (
        invoiceNumber < 1 ||
        invoiceNumber > MAX_INVOICE_NUMBER_ALLOWED_TO_BE_ENTERED
      ) {
        return res.status(400).json({
          message: `Invoice number must be between 1 and ${MAX_INVOICE_NUMBER_ALLOWED_TO_BE_ENTERED}`,
        });
      }
      const invoiceWithSameNumber = await Invoice.findOne({
        invoiceNumber: invoiceNumber,
      });
      if (invoiceWithSameNumber) {
        return res.status(400).json({
          message: "Invoice number already exists",
        });
      }
    }

    const newInvoice = new Invoice({
      invoiceNumber: invoiceNumber || undefined,
      driverName,
      customer: customerId,
      isPaid,

      // finance
      totalPriceLbp,
      totalPriceUsd,
      amountPaidUsd,
      amountPaidLbp,
      taxesUsd,
      taxesLbp,
      discount,
      finalPriceUsd,
      remainingAmountUsd,
      totalPaidUsd: totalAmountPaidUsd,
      usdRate: accounting?.usdRate,

      vehicle: vehicleId ? vehicleId : null,
      generalNote,
      customerNote,
      createdBy: getAuthUserData(req)._id,
      products: products.map((prod) => ({
        product: prod.productId,
        quantity: prod.quantity,
      })),
      services: services.map((service) => ({
        name: service.name,
        quantity: service.quantity,
        price: service.price,
      })),
    });
    await newInvoice.save();

    await decreaseProductsStock(products, productsDB);

    // in not paid, increase the customer loan (total - paid)
    if (!isPaid) {
      if (remainingAmountUsd > 0)
        await Customer.findByIdAndUpdate(customerId, {
          $inc: {
            loan: remainingAmountUsd,
          },
        });
    }

    // if vehicle is set, update it's last service date
    if (vehicleId) {
      await Vehicle.findByIdAndUpdate(vehicleId, {
        $set: { lastServiceDate: new Date() },
      });
    }

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
    // populate the fields
    const populatedInvoice = await newInvoice.populate([
      "customer",
      "createdBy",
      "vehicle",
      "products.product",
    ]);
    // .execPopulate();

    res
      .status(201)
      .json({ message: "Invoice saved successfully", data: populatedInvoice });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const editInvoice = async (req: Request, res: Response) => {
  try {
    const {
      invoiceNumber,
      driverName,
      discount,
      customerId,
      isPaid,
      vehicleId,
      services,
      products,
      generalNote,
      customerNote,
      amountPaidUsd,
      amountPaidLbp,
    }: CreateEditInvoiceFields = req.body;

    const invoiceId = req.params.invoiceId;

    // Fetch old invoice
    const oldInvoice = await Invoice.findById(invoiceId);
    if (!oldInvoice) {
      throw new Error("Invoice not found"); // Throw an error if invoice doesn't exist
    }

    // Revert old invoice effects before applying new changes
    await revertInvoice(oldInvoice);

    // Fetch accounting and organization data
    const accounting = await Accounting.findById(accountingId);
    const organizationInfo = await Organization.findById(organizationId);

    // Validate product stock
    const productsDB = await Product.find({
      _id: { $in: products.map((prod) => prod.productId) },
    });
    validateProductsStock(products, productsDB);

    // Compute financials: total price, discount, taxes, final price, etc.
    const totalPriceUsd = computeTotalPrice(products, productsDB, services);
    const totalPriceLbp = totalPriceUsd * accounting!.usdRate;
    let discountAmountUsd = 0;
    if (discount?.amount) {
      discountAmountUsd =
        discount.type === "percentage"
          ? (totalPriceUsd * discount.amount) / 100
          : discount.amount;
    }
    const taxesUsd =
      ((totalPriceUsd - discountAmountUsd) *
        Number(organizationInfo!.tvaPercentage)) /
      100;
    const taxesLbp = taxesUsd * accounting!.usdRate;
    const finalPriceUsd = totalPriceUsd - discountAmountUsd + taxesUsd;
    const amountPaidLbpConvertedToUsd = Number(
      (amountPaidLbp / accounting!.usdRate).toFixed(2)
    );
    const totalAmountPaidUsd = Number(
      (amountPaidUsd + amountPaidLbpConvertedToUsd).toFixed(2)
    );
    const remainingAmountUsd = Number(
      (finalPriceUsd - totalAmountPaidUsd).toFixed(2)
    );

    //  Update the invoice number in case passed diff than the current one
    if (invoiceNumber && invoiceNumber !== oldInvoice.invoiceNumber) {
      // check if between the range
      if (
        invoiceNumber < 1 ||
        invoiceNumber > MAX_INVOICE_NUMBER_ALLOWED_TO_BE_ENTERED
      ) {
        throw new Error(
          `Invoice number must be between 1 and ${MAX_INVOICE_NUMBER_ALLOWED_TO_BE_ENTERED}`
        );
      }

      // check the unique constraint
      const invoiceWithSameNumber = await Invoice.findOne({
        _id: { $ne: invoiceId },
        invoiceNumber: invoiceNumber,
      });
      if (invoiceWithSameNumber) {
        throw new Error(`Invoice number already exists`);
      }
    }

    // Update the invoice document
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      {
        $set: {
          invoiceNumber: invoiceNumber || undefined,
          driverName,
          customer: customerId,
          isPaid,
          usdRate: accounting?.usdRate,
          totalPriceLbp,
          totalPriceUsd,
          amountPaidUsd,
          amountPaidLbp,
          taxesLbp,
          discount,
          finalPriceUsd,
          remainingAmountUsd,
          totalPaidUsd: totalAmountPaidUsd,
          vehicle: vehicleId ? vehicleId : null,
          generalNote,
          customerNote,
          createdBy: getAuthUserData(req)._id,
          products: products.map((prod) => ({
            product: prod.productId,
            quantity: prod.quantity,
          })),
          services: services.map((service) => ({
            name: service.name,
            quantity: service.quantity,
            price: service.price,
          })),
        },
      },
      {
        new: true,
        populate: ["customer", "createdBy", "vehicle", "products.product"],
      }
    );

    // Update product stock and customer loan (if applicable)
    await decreaseProductsStock(products, productsDB);
    if (!isPaid && remainingAmountUsd > 0) {
      await Customer.findByIdAndUpdate(customerId, {
        $inc: { loan: remainingAmountUsd },
      });
    }

    // Update vehicle last service date (if applicable)
    if (vehicleId) {
      await Vehicle.findByIdAndUpdate(vehicleId, {
        $set: { lastServiceDate: new Date() },
      });
    }

    // Update accounting records
    await Accounting.findByIdAndUpdate(accountingId, {
      $inc: { totalIncome: totalAmountPaidUsd },
    });

    // Update daily report
    await Report.findOneAndUpdate(
      { date: formatISODate(new Date()) },
      { $inc: { totalIncome: totalAmountPaidUsd - oldInvoice.totalPaidUsd } },
      { new: true, upsert: true }
    );

    // Success response
    return res
      .status(200)
      .json({ message: "Invoice updated successfully", data: updatedInvoice });
  } catch (error) {
    console.error("Edit Invoice Error:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

/**
 * Delete an invoice
 */
export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const invoiceId = req.params.invoiceId;
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      res.status(404).json({ message: "Invoice not found" });
      return;
    }

    // revert invoice effects
    await revertInvoice(invoice);

    //NOTE: made this here not in reverInvoice due to write conflict in the transaction in editInvoice
    // decrease date income in report (the total paid)
    await Report.findOneAndUpdate(
      { date: formatISODate(invoice.createdAt) },
      {
        $inc: {
          totalIncome: invoice.totalPaidUsd * -1,
        },
      },
      { new: true, upsert: true }
    );

    // delete invoice
    await Invoice.deleteOne({ _id: invoiceId });

    // add the invoiceNumber to the availableSequences
    const counter = await InvoiceCounter.findById(COUNTERID);
    if (counter) {
      counter.availableSequences.push(invoice.invoiceNumber);
      // Sort available sequences in ascending order
      counter.availableSequences.sort((a, b) => a - b);
      await counter.save();
    }

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ------------ Utils -------------
async function revertInvoice(invoice: IInvoice) {
  // increase products stock
  const removedProducts = invoice.products.map((prod) => ({
    productId: prod.product?.toString(),
    quantity: prod.quantity,
  }));
  const removedProductsDB = await Product.find({
    _id: { $in: removedProducts.map((prod) => prod.productId?.toString()) },
  });
  await increaseProductsStock(removedProducts, removedProductsDB);

  // decrease customer loan (in case not paid)
  // else there will be no loan left from this invoice
  if (!invoice.isPaid) {
    await Customer.findByIdAndUpdate(invoice.customer, {
      $inc: {
        loan: invoice.remainingAmountUsd * -1,
      },
    });
  }

  // decrease total income (the total paid)
  await Accounting.findByIdAndUpdate(accountingId, {
    $inc: {
      totalIncome: invoice.totalPaidUsd * -1,
    },
  });

  // reset vehicle last service date (in case vehicle set)
  if (invoice.vehicle) {
    // 1. get the last invoice for this vehicle before the deleted one
    const lastInvoice = await Invoice.findOne({
      vehicle: invoice.vehicle,
      createdAt: { $lt: invoice.createdAt },
    });
    // 2. if there is a last invoice, update it's vehicle last service date
    if (lastInvoice) {
      await Vehicle.findByIdAndUpdate(lastInvoice.vehicle, {
        $set: { lastServiceDate: lastInvoice.createdAt },
      });
    } else {
      // 3. if there is no last invoice, update the vehicle last service date to null
      await Vehicle.findByIdAndUpdate(invoice.vehicle, {
        $set: { lastServiceDate: null },
      });
    }
  }
}

function validateProductsStock(
  productsToValidate: { productId: string; quantity: number }[],
  productsDB: IProduct[]
) {
  // validate stock for products that manage stock
  productsToValidate.forEach((prodToSell) => {
    const prodDB = productsDB.find(
      (prod) => prod._id?.toString() === prodToSell.productId
    );
    if (!prodDB) throw new Error("Product not found");

    if (prodDB?.stock! < prodToSell.quantity)
      throw new Error(`Not enough stock for ${prodDB.name}`);
  });
}

function computeTotalPrice(
  products: { productId: string; quantity: number }[],
  productsDB: IProduct[],
  services: { name: string; quantity: number; price: number }[]
) {
  const totalProductsPrice = products.reduce((acc, prodToSell) => {
    const prodDB = productsDB.find(
      (prod) => prod._id?.toString() === prodToSell.productId
    );
    if (!prodDB) throw new Error("Product not found");

    return acc + prodDB.price * prodToSell?.quantity;
  }, 0);

  const totalServicesPrice = services.reduce(
    (acc, service) => acc + service.price * service.quantity,
    0
  );

  return totalProductsPrice + totalServicesPrice;
}

async function decreaseProductsStock(
  products: { productId: string; quantity: number }[],
  productsDB: IProduct[]
) {
  for (const prodToSell of products) {
    const prodDB = productsDB.find(
      (prod) => prod._id?.toString() === prodToSell.productId
    );
    if (!prodDB) throw new Error("Product not found");

    await Product.findByIdAndUpdate(prodToSell.productId, {
      $inc: { stock: -prodToSell.quantity },
    });
  }
}

async function increaseProductsStock(
  products: { productId: string; quantity: number }[],
  productsDB: IProduct[]
) {
  for (const prodToSell of products) {
    const prodDB = productsDB.find(
      (prod) => prod._id?.toString() === prodToSell.productId
    );
    if (!prodDB) throw new Error("Product not found");

    await Product.findByIdAndUpdate(prodToSell.productId, {
      $inc: { stock: prodToSell.quantity },
    });
  }
}
