import express from "express";
import {
  getProductImages,
  addProductImage,
  updateImage,
  deleteImage
} from "../controllers/productImageController.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
import { uploadProductImage } from "../middleware/uploadMiddleware.js";
import {
  createProductImageSchema,
  updateProductImageSchema
} from "../validation/productImage.schema.js";

// mergeParams: true allows us to access productId from the parent router
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getProductImages)
  .post(uploadProductImage.single('image'), validationMiddleware(createProductImageSchema), addProductImage);

router
  .route("/:id")
  .patch(validationMiddleware(updateProductImageSchema), updateImage)
  .delete(deleteImage);

export default router;
