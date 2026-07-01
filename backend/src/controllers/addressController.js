import {
  getUserAddresses,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setUserDefaultAddress,
} from "../services/addressService.js";
import catchAsync from "../utils/catchAsync.js";

export const getAddresses = catchAsync(async (req, res, next) => {
  const addresses = await getUserAddresses(req.user.id);

  res.status(200).json({
    status: "success",
    data: addresses,
  });
});

export const createAddress = catchAsync(async (req, res, next) => {
  const address = await createUserAddress(req.user.id, req.body);

  res.status(201).json({
    status: "success",
    data: address,
  });
});

export const updateAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedAddress = await updateUserAddress(req.user.id, id, req.body);

  res.status(200).json({
    status: "success",
    data: updatedAddress,
  });
});

export const deleteAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedAddress = await deleteUserAddress(req.user.id, id);

  res.status(204).send();
});

export const setDefaultAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const defaultAddress = await setUserDefaultAddress(req.user.id, id);

  res.status(200).json({
    status: "success",
    data: defaultAddress,
  });
});
