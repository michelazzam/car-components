import { Request, Response } from "express";
import Service, { IService } from "./service.model.js";
import { FilterQuery } from "mongoose";

/**
 * Get all services
 */
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const { search, pageIndex } = req.query;

    const pageSize = 10;
    const filter: FilterQuery<IService> = {};

    if (search) {
      filter.$or = [{ name: { $regex: search, $options: "i" } }];
    }

    const [totalCount, services] = await Promise.all([
      Service.countDocuments(filter),
      Service.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(pageIndex) || 0) * pageSize)
        .limit(pageSize),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return res.json({
      services,
      pageIndex,
      pageSize,
      totalCount,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Create a new service
 */
export const createService = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const newService = new Service({
      name,
    });
    await newService.save();

    res
      .status(201)
      .json({ message: "Service created successfully", data: newService });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error", error });
  }
};
