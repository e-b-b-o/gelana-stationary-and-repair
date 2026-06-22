import express from "express";

import {
  getProducts,
  getProduct,
  createNewProduct,
  updateExistingProduct,
  removeProduct,
} from "../controllers/productController.js";

import AppError from "../utils/AppError.js";
import validationMiddleware from "../middleware/validationMiddleware.js";

import {
  createProductSchema,
  updateProductSchema,
} from "../validation/product.schema.js";
import { getProductById } from "../services/productService.js";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(validationMiddleware(createProductSchema), createNewProduct);

router
  .route("/:id")
  .get(getProductById)
  .patch(validationMiddleware(updateProductSchema), updateExistingProduct)
  .delete(removeProduct);

export default router;
