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
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/restrictTo.js";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    restrictTo("ADMIN"),
    validationMiddleware(createProductSchema),
    createNewProduct,
  );

router
  .route("/:id")
  .get(getProductById)
  .patch(
    protect,
    restrictTo("ADMIN"),
    validationMiddleware(updateProductSchema),
    updateExistingProduct,
  )
  .delete(protect, restrictTo("ADMIN"), removeProduct);

export default router;
