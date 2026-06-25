import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { verifyToken } from "../utils/jwt.js";

export const protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new AppError("User not logged in", 401));
  }

  const decoded = verifyToken(token);

  req.user = decoded;

  next();
});
