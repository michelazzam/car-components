import { Request, Response } from "express";

import { doesPasswordsMatch } from "../../lib/password-utils.js";
import { generateJwtToken } from "../../lib/jwt-utils.js";
import { getAuthUserData } from "./utils/get-auth-user-data.js";
import User from "./user.model.js";

/**
 * @desc interal function used to populate superAmsAdmin user
 */
export async function populateSuperAmsAdmin() {
  try {
    const superAmsAdmin = await User.findOne({
      role: "superAmsAdmin",
    });

    if (superAmsAdmin) {
      console.log("superAmsAdmin user already exists");
    } else {
      await User.create({
        fullName: "Super AMS Admin",
        username: "ams",
        password: "admin",
        role: "superAmsAdmin",
      });

      console.log("superAmsAdmin user created successfully");
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * @desc get all users
 */
export async function getUsers(_: Request, res: Response) {
  try {
    const users = await User.find({
      isActive: true,
      role: { $ne: "superAmsAdmin" },
    })
      .sort({ createdAt: -1 })
      .select("-password -isActive -__v");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

/**
 * @desc get logged in user using jwt token
 */
export async function getLoggedInUser(req: Request, res: Response) {
  try {
    const userId = getAuthUserData(req)._id;
    const user = await User.findOne({ _id: userId, isActive: true }).select(
      "-password -isActive -__v"
    );
    if (!user) res.status(401).json({ message: "Not authenticated" });

    const token = generateJwtToken({ userId: userId?.toString() });

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

/**
 * @desc Add a new user
 */
export async function addUser(req: Request, res: Response) {
  try {
    const { fullName, username, role, password, phoneNumber, address } =
      req.body;

    // only super admins can set role to admin
    // const authUser = getAuthUserData(req);
    // if (authUser.role === "admin" && role === "admin") {
    //   return res
    //     .status(400)
    //     .json({ message: "You cannot set role to an admin" });
    // }

    await User.create({
      fullName,
      username: username.toLowerCase(),
      role,
      password,
      phoneNumber,
      address,
    });

    res.json({ message: "User added successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "User with this username already exists" });
    }
    res.status(500).json({ message: error.message || "Server error", error });
  }
}

/**
 * @desc Edit user
 */
export async function editUser(req: Request, res: Response) {
  try {
    const userId = req.params.id;

    const { fullName, username, role, phoneNumber, address, password } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    //superAmsAdmin , it can't be edited
    if (user.role === "superAmsAdmin") {
      return res
        .status(400)
        .json({ message: "You cannot edit a super ams admin" });
    }

    // only super admins can set role to admin
    const authUser = getAuthUserData(req);
    if (authUser.role === "admin" && role === "admin") {
      return res
        .status(400)
        .json({ message: "You cannot set role to an admin" });
    }

    await User.findByIdAndUpdate(userId, {
      fullName,
      username: username.toLowerCase(),
      role,
      phoneNumber,
      address,
      password,
    });

    res.json({ message: "User updated successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "User with this username already exists" });
    }
    res.status(500).json({ message: error.message || "Server error", error });
  }
}

/**
 * @desc Delete a user
 */
export async function deleteUser(req: Request, res: Response) {
  try {
    const userId = req.params.id;

    // Check if the user is trying to delete themselves
    const authUser = getAuthUserData(req);
    if (authUser._id.toString() === userId) {
      return res
        .status(403)
        .json({ message: "You cannot delete your own account" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // just set isActive to false, to keep history
    await User.findByIdAndUpdate(userId, {
      isActive: false,
      // When we delete the user and we try to create a new one with the same username, an error occurs. So we append the userId to the username to make it unique.
      username: `${user.username}-${userId}`,
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

/**
 * @desc Login a user with username and password
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      username: username.toLowerCase(),
      isActive: true,
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const validPassword = await doesPasswordsMatch(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = generateJwtToken({ userId: user._id?.toString() });

    res.json({
      message: "User logged in successfully",
      data: {
        token,
        user: {
          fullName: user.fullName,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error", error });
  }
};

/**
 * @desc Change password of a user
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = (await User.findById(getAuthUserData(req)._id))!;

    const validPassword = await doesPasswordsMatch(
      currentPassword,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error", error });
  }
};

/**
 * @desc Edit profile of logged in user
 */

export async function editProfile(req: Request, res: Response) {
  try {
    const { fullName, username, phoneNumber, address } = req.body;

    const user = (await User.findById(getAuthUserData(req)._id))!;

    user.fullName = fullName;
    user.username = username.toLowerCase();
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;

    await user.save();

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "User with this username already exists" });
    }
    res.status(500).json({ message: error.message || "Server error", error });
  }
}

/**
 * @desc Check if user is admin
 */
export async function checkIsAdmin(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      username: username.toLowerCase(),
      isActive: true,
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const validPassword = await doesPasswordsMatch(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    res.json({
      isAdmin: user.role === "admin" || user.role === "superAmsAdmin",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
