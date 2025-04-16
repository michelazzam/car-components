import express from "express";
import {
  addUser,
  changePassword,
  deleteUser,
  editProfile,
  editUser,
  getLoggedInUser,
  getUsers,
  checkIsAdmin,
  login,
} from "./user.controller.js";
import {
  addUserValidationRules,
  editUserValidationRules,
  userChangePasswordValidationRules,
  userEditProfileValidationRules,
  loginUserValidationRules,
} from "./user.validation.js";
import { validationErrorHandler } from "../../middlewares/errors.middleware.js";
import { isAuthenticated } from "../../middlewares/is-authenticated.middleware.js";
import { isAdmin } from "../../middlewares/is-admin.middleware.js";

const router = express.Router();

// user related routes
router.get("/", isAuthenticated, isAdmin, getUsers);

// Add user
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  addUserValidationRules,
  validationErrorHandler,
  addUser
);

// auth related routes
router.get("/auth", isAuthenticated, getLoggedInUser);

router.post("/login", loginUserValidationRules, validationErrorHandler, login);

router.post("/is-admin", isAuthenticated, checkIsAdmin);

router.put(
  "/edit-profile",
  isAuthenticated,
  userEditProfileValidationRules,
  validationErrorHandler,
  editProfile
);

router.put(
  "/change-password",
  isAuthenticated,
  userChangePasswordValidationRules,
  validationErrorHandler,
  changePassword
);

// Delete user
router.delete("/:id", isAuthenticated, isAdmin, deleteUser);

// Edit user
router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  editUserValidationRules,
  validationErrorHandler,
  editUser
);

export { router as userRoute };
