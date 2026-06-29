import catchAsync from "../utils/catchAsync.js";
import {
  getCart,
  addToCart,
  updateCart,
  deleteCart,
  clearCart,
} from "../services/cartService.js";
import AppError from "../utils/AppError.js";

export const getAllCart = catchAsync(async (req, res, next) => {
  const cart = await getCart(req.user.id);
  res.status(200).json({
    status: "success",
    data: {
      cart
    }
  });
});

export const addCartItem = catchAsync(async (req, res, next) => {
  const { product_id, quantity } = req.body;
  if (!product_id) {
    return next(new AppError("Please provide a product_id", 400));
  }

  const cartItem = await addToCart(req.user.id, product_id, quantity || 1);

  res.status(201).json({
    status: "success",
    data: {
      item: cartItem
    }
  });
});

export const updateCartItem = catchAsync(async (req, res, next) => {
  const { id: product_id } = req.params;
  const { quantity } = req.body;
  
  if (!quantity) {
    return next(new AppError("Please provide a quantity to update", 400));
  }

  const updatedCartItem = await updateCart(req.user.id, product_id, quantity);

  res.status(200).json({
    status: "success",
    data: {
      item: updatedCartItem
    }
  });
});

export const deleteCartItem = catchAsync(async (req, res, next) => {
  const { id: product_id } = req.params;
  
  await deleteCart(req.user.id, product_id);

  res.status(204).json({
    status: "success",
    data: null
  });
});

export const clearAllCart = catchAsync(async (req, res, next) => {
  await clearCart(req.user.id);

  res.status(204).json({
    status: "success",
    data: null
  });
});
