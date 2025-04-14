import { NextFunction, Request, Response } from "express";

export function logApiCalls(req: Request, _: Response, next: NextFunction) {
  const currentTime = new Date();

  console.log(
    `${req.method} ${req.originalUrl} - ${currentTime.toISOString()} `
  );

  next(); // Pass control to the next middleware function
}
