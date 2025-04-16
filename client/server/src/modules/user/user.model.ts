import { Schema, model } from "mongoose";
import { hashPassword } from "../../lib/password-utils.js";

export const userRoles = ["employee", "admin", "superAmsAdmin"] as const;

export type UserRole = (typeof userRoles)[number];

export interface IUser {
  fullName: string;
  username: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  phoneNumber: string;
  address: string;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: userRoles,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
// on save
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password.trim());
  }
  next();
});

// on edit
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;

  // We check for both update.$set.password and update.password to cover different ways the update might be structured.
  if (update && update.$set && update.$set.password) {
    update.$set.password = await hashPassword(update.$set.password.trim());
  } else if (update && update.password) {
    update.password = await hashPassword(update.password.trim());
  }

  next();
});

const User = model("User", userSchema);
export default User;
