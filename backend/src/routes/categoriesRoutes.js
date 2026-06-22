import express from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
import {
  createCategorySchema,
  updateCategorySchema
} from "../validation/category.schema.js";

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(validationMiddleware(createCategorySchema), createCategory);

router
  .route("/:id")
  .get(getCategory)
  .patch(validationMiddleware(updateCategorySchema), updateCategory)
  .delete(deleteCategory);

export default router;
