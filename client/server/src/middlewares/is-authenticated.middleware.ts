import asyncHandler from "express-async-handler";
import { verifyJwtToken } from "../lib/jwt-utils.js";
import User from "../modules/user/user.model.js";

export const isAuthenticated = asyncHandler(
  async (req: any, res: any, next: any) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthenticated" });
      }

      const decodedToken = verifyJwtToken(token);
      if (!decodedToken) {
        return res.status(401).json({ message: "Unauthenticated" });
      }

      const user = await User.findById(decodedToken.userId);

      if (user) {
        req.user = user;
        next();
      } else {
        return res.status(401).json({ message: "Unauthenticated" });
      }
    } catch (error) {
      return res.status(401).json({ message: "Unauthenticated" });
    }
  }
);
