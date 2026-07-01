import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "../controllers/addressController.js";
import {
  createAddressSchema,
  updateAddressSchema,
} from "../validation/address.schema.js";
import validationMiddleware from "../middleware/validationMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getAddresses)
  .post(validationMiddleware(createAddressSchema), createAddress);

router
  .route("/:id")
  .patch(validationMiddleware(updateAddressSchema), updateAddress)
  .delete(deleteAddress);

router.route("/:id/default").patch(setDefaultAddress);

export default router;
