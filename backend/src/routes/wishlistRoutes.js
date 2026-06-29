import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import {
  addWishlistItem,
  clearAllWishlist,
  deleteWishlistItem,
  getMyWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

// ALL wishlist routes require authentication
router.use(protect);

router
  .route("/")
  .get(getMyWishlist)
  .post(addWishlistItem)
  .delete(clearAllWishlist);

router
  .route("/:id")
  .delete(deleteWishlistItem);

export default router;
