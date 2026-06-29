import catchAsync from "../utils/catchAsync.js";
import {
  getWishlist,
  addToWishlist,
  removeWishlistItem,
  clearWishlist,
} from "../services/wishlistService.js";
import AppError from "../utils/AppError.js";

export const getMyWishlist = catchAsync(async (req, res, next) => {
  const wishlist = await getWishlist(req.user.id);
  res.status(200).json({
    status: "success",
    data: {
      wishlist
    }
  });
});

export const addWishlistItem = catchAsync(async (req, res, next) => {
  const { product_id } = req.body;
  if (!product_id) {
    return next(new AppError("Please provide a product_id", 400));
  }

  const wishlistItem = await addToWishlist(req.user.id, product_id);

  res.status(201).json({
    status: "success",
    data: {
      item: wishlistItem
    }
  });
});

export const deleteWishlistItem = catchAsync(async (req, res, next) => {
  const { id: product_id } = req.params;
  
  await removeWishlistItem(req.user.id, product_id);

  res.status(204).json({
    status: "success",
    data: null
  });
});

export const clearAllWishlist = catchAsync(async (req, res, next) => {
  await clearWishlist(req.user.id);

  res.status(204).json({
    status: "success",
    data: null
  });
});
