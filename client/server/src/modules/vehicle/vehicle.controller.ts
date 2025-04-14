import { Request, Response } from "express";
import Vehicle, { IVehicle } from "./vehicle.model.js";
import { FilterQuery } from "mongoose";
import Customer from "../customer/customer.model.js";
import Invoice from "../invoice/invoice.model.js";

/**
 * Get all vehicles
 */
export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const {pageSize, pageIndex, search, customerId, gasTypeId } = req.query;

    // const pageSize = 10;
    const filter: FilterQuery<IVehicle> = {};

    // Add customer filter
    if (customerId) {
      filter.customer = customerId;
    }

    // Add gasType filter
    if (gasTypeId) {
      filter.gasType = gasTypeId;
    }

    // Add search filter
    if (search) {
      filter.$or = [
        { model: { $regex: search, $options: "i" } },
        { vehicleNb: { $regex: search, $options: "i" } },
      ];
    }

    const [vehicles, totalCount] = await Promise.all([
      Vehicle.find(filter)
        .sort({ createdAt: -1 })
        .populate("customer", "name")
        .populate("gasType", "title")
        .skip((Number(pageIndex) || 0) * Number(pageSize))
        .limit(Number(pageSize)),
      Vehicle.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / Number(pageSize));

    res.json({ vehicles, pageIndex, pageSize, totalCount, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Create a new vehicle
 */
export const createVehicle = async (req: Request, res: Response) => {
  // TODO: make it transactional

  try {
    const { customerId, model, gasTypeId, vehicleNb } = req.body;

    const newVehicle = new Vehicle({
      customer: customerId,
      model,
      gasType: gasTypeId,
      vehicleNb,
    });
    await newVehicle.save();

    // increment the vehicle counter
    await Customer.findByIdAndUpdate(customerId, {
      $inc: { totalVehicles: 1 },
    });

    res.status(201).json({
      message: "Vehicle created successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Vehicle with this vehicleNb already exists" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Update a single vehicle by its ID
 */
export const updateVehicle = async (req: Request, res: Response) => {
  // TODO: make it transactional
  try {
    const { vehicleId } = req.params;

    const { customerId, model, gasTypeId, vehicleNb } = req.body;

    const oldVehicle = await Vehicle.findById(vehicleId);
    if (!oldVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // in case customer changed, update the vehicle counter
    if (oldVehicle.customer !== customerId) {
      // decrement the old vehicle counter for the old customer
      await Customer.findByIdAndUpdate(oldVehicle.customer, {
        $inc: { totalVehicles: -1 },
      });

      // increment the vehicle counter for the new customer
      await Customer.findByIdAndUpdate(customerId, {
        $inc: { totalVehicles: 1 },
      });
    }

    await Vehicle.findByIdAndUpdate(vehicleId, {
      customer: customerId,
      model,
      gasType: gasTypeId,
      vehicleNb,
    });

    res.json({ message: "Vehicle updated successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Vehicle with this vehicleNb already exists" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 *
 * @desc Delete a single vehicle by its ID
 */
export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    // cannot delete if linked to invoices
    const invoice = await Invoice.findOne({ vehicle: vehicleId });
    if (invoice) {
      return res
        .status(400)
        .json({ message: "Cannot delete vehicle with invoices" });
    }

    const vehicle = await Vehicle.findByIdAndDelete(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // decrement the vehicle counter for the customer
    await Customer.findByIdAndUpdate(vehicle.customer, {
      $inc: { totalVehicles: -1 },
    });

    await Vehicle.deleteOne({ _id: vehicleId });

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
