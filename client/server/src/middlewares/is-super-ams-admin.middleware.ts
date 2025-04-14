import asyncHandler from "express-async-handler";
import { getAuthUserData } from "../modules/user/utils/get-auth-user-data.js";

export const isSuperAmsAdmin = asyncHandler(
  async (req: any, res: any, next: any) => {
    const user = getAuthUserData(req);

    if (user.role !== "superAmsAdmin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  }
);
