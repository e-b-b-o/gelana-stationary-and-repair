import express from "express";
import { register, login, getProfile } from "../controllers/userController.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validation/user.schema.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", validationMiddleware(registerUserSchema), register);
router.post("/login", validationMiddleware(loginUserSchema), login);

// Protected routes (You will add authMiddleware here later)
router.get("/:id/profile", protect, getProfile);

export default router;
