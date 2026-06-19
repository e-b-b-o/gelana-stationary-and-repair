import { getAllProducts, getProductById } from "../services/productService.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const getProducts = catchAsync(async (req, res, next) => {
  const products = await getAllProducts();

  res.status(200).json(products);
});

export const getProduct = catchAsync(async (req, res, next) => {
  const product = await getProductById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.json(product);
});
