import {
  createUser,
  getUserByEmail,
  getUserById,
} from "../services/userService.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.js";

export const register = catchAsync(async (req, res, next) => {
  // Check if user already exists
  const existingUser = await getUserByEmail(req.body.email);
  if (existingUser) {
    return next(new AppError("Email already in use", 400));
  }

  // Create user
  // hanlded bcrypt inside the userService
  const newUser = await createUser(req.body);

  //generate Token
  const token = signToken(newUser.id, newUser.role);

  //register cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    status: "success",
    data: newUser,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user
  const user = await getUserByEmail(email);

  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  // You will replace this with bcrypt.compare()
  const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
  // Prevent sending password hash back to the client
  if (!isPasswordCorrect) {
    return next(new AppError("Invalid email or password", 401));
  }

  // You will generate and send the JWT cookie here
  const token = signToken(user.id, user.role);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 100,
  });

  // Prevent sending password hash back to the client
  delete user.password_hash;

  res.status(200).json({
    status: "success",
    message: "Login successful. JWT implementation pending.",
    data: user,
  });
});

export const getProfile = catchAsync(async (req, res, next) => {
  // In the future, the user ID will come from the decoded JWT via req.user.id
  // For now, we'll just mock it and use params for testing

  const userId = req.user.id;

  const user = await getUserById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    status: "success",
  });
};
