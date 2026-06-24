import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { verifyToken } from "../utils/jwt";

export const protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new AppError("User not logged in", 401));
  }

  const decoded = verifyToken(token);

  req.user = decoded;

  next();
});
