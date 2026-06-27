import express from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validation/category.schema.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/restrictTo.js";

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(
    protect,
    restrictTo("ADMIN"),
    validationMiddleware(createCategorySchema),
    createCategory,
  );

router
  .route("/:id")
  .get(getCategory)
  .patch(
    protect,
    restrictTo("ADMIN"),
    validationMiddleware(updateCategorySchema),
    updateCategory,
  )
  .delete(protect, restrictTo("ADMIN"), deleteCategory);

export default router;
