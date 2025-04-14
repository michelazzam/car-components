import { Request, Response } from "express";
import Accounting, { accountingId } from "./accounting.model.js";

export const populateAccountingDocument = async () => {
  try {
    const accounting = await Accounting.findOne({
      _id: accountingId,
    });
    if (accounting) {
      console.log("Accounting document already exists");
    } else {
      await Accounting.create({
        _id: accountingId,
        usdRate: 90000,
      });

      console.log("Accounting document created successfully");
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * @api {get} /accounting/usdRate Get usdRate
 */
export const getUsdRate = async (_: Request, res: Response) => {
  try {
    const data = await Accounting.findOne({
      _id: accountingId,
    }).select("usdRate");

    res.json({ usdRate: data?.usdRate || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fetching usdRate failed", error });
  }
};

/**
 * @api {put} /accounting/usdRate Update usdRate (admin only)
 */
export const updateUsdRate = async (req: Request, res: Response) => {
  try {
    const { usdRate } = req.body;

    await Accounting.findOneAndUpdate(
      { _id: accountingId },
      { usdRate: usdRate }
    );

    res.json({ message: "USD Rate updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Updating the Usd Rate failed",
      error,
    });
  }
};
