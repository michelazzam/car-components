import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const globalErrorHandler = (
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

export const validationErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  const errMessage = errors
    ?.array()
    ?.map((err) => err.msg)
    ?.join(", ");

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errMessage || "Invalid request" });
  }

  next();
};
