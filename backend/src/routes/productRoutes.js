import express from "express";

import { getProducts, getProduct } from "../controllers/productController.js";
import AppError from "../utils/AppError.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProduct);

export default router;
