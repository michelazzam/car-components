import { Request, Response } from "express";
import GasType from "./gasType.model.js";
import Vehicle from "../vehicle/vehicle.model.js";

/**
 * Get all expenseTypes
 */
export const getAllGasTypes = async (_: Request, res: Response) => {
  try {
    const gasTypes = await GasType.find().sort({ createdAt: -1 });

    res.json(gasTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Create a new gas Type
 */
export const createGasType = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    const newGasType = new GasType({
      title,
    });

    await newGasType.save();

    res.status(201).json({
      message: "Gas Type created successfully",
      data: newGasType,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Gas Type with this title already exists" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Update a single gasType by its ID
 */
export const updateGasType = async (req: Request, res: Response) => {
  try {
    const { gasTypeId } = req.params;

    const { title } = req.body;

    await GasType.findByIdAndUpdate(gasTypeId, {
      title,
    });

    res.json({ message: "Gas Type updated successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Gas Type with this title already exists" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 *
 * @desc Delete a single gasType by its ID
 */
export const deleteGasType = async (req: Request, res: Response) => {
  try {
    const { gasTypeId } = req.params;

    // cannot delete if it is used in a vehicle
    const inVehicle = await Vehicle.findOne({ gasType: gasTypeId });
    if (inVehicle) {
      return res.status(400).json({ message: "Gas Type is used in vehicles" });
    }

    const deletedGasType = await GasType.findByIdAndDelete(gasTypeId);
    if (!deletedGasType) {
      return res.status(404).json({ message: "Gas Type not found" });
    }

    res.status(200).json({ message: "Gas Type deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
