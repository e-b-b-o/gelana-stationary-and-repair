import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../services/productService.js";
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

export const createNewProduct = catchAsync(async (req, res, next) => {
  const product = await createProduct(req.body);
  res.status(201).json(product);
});

export const updateExistingProduct = catchAsync(async (req, res, next) => {
  const product = await updateProduct(req.params.id, req.body);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(201).json(product);
});

export const removeProduct = catchAsync(async (req, res, next) => {
  const product = await deleteProduct(req.params.id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(201).send();
});
