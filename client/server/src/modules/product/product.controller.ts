import { Request, Response } from "express";
import Product, { IProduct } from "./product.model.js";
import { FilterQuery } from "mongoose";

/**
 * Get all products
 */
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { search, pageIndex, pageSize } = req.query;

    // const pageSize = 10;
    const filter: FilterQuery<IProduct> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { note: { $regex: search, $options: "i" } },
      ];
    }

    const [totalCount, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(pageIndex) || 0) * Number(pageSize))
        .limit(Number(pageSize)),
    ]);

    const totalPages = Math.ceil(totalCount / Number(pageSize));

    return res.json({
      products,
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
 * Create a new product
 */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, brand, price, cost, stock, note } = req.body;

    const newProduct = new Product({
      name,
      brand,
      price,
      cost,
      stock,
      note,
    });

    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product created successfully", data: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error", error });
  }
};

/**
 * Update a single product by its ID
 */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const { name, brand, price, cost, note } = req.body;

    await Product.findByIdAndUpdate(productId, {
      name,
      brand,
      price,
      cost,
      note,
    });

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error", error });
  }
};

/**
 * Increment stock of a product by its ID
 */
export const incrementOrDecrementStock = async (
  req: Request,
  res: Response
) => {
  try {
    const { productId } = req.params;
    const { amount, action } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (action === "decrease" && product.stock < Math.abs(amount)) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    await Product.findOneAndUpdate(
      {
        _id: productId,
      },
      {
        $inc: {
          stock: action === "increase" ? Math.abs(amount) : -Math.abs(amount),
        },
      }
    );

    res.json({ message: "Product stock updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error", error });
  }
};

/**
 *
 * @desc Delete a single product by its ID
 */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    //TODO: cannot delete if it is used in orders

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
