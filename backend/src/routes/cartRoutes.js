import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import {
  addCartItem,
  clearAllCart,
  deleteCartItem,
  getAllCart,
  updateCartItem,
} from "../controllers/cartController.js";

const router = express.Router();

// ALL cart routes require authentication
router.use(protect);

router.route("/").get(getAllCart).post(addCartItem).delete(clearAllCart);

router.route("/:id").patch(updateCartItem).delete(deleteCartItem);

export default router;
