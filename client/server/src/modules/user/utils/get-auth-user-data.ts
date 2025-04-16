import { Request } from "express";
import { IUser } from "../user.model.js";
import { Types } from "mongoose";

export function getAuthUserData(req: Request) {
  //@ts-ignore
  return req.user as IUser & { _id: Types.ObjectId };
}
