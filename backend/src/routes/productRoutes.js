import express from "express";

import { getProducts, getProduct } from "../controllers/productController.js";
import AppError from "../utils/AppError.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
import { createProductSchema } from "../validation/product.schema.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProduct);

router.post("/", validationMiddleware(createProductSchema), createProduct);

export default router;
