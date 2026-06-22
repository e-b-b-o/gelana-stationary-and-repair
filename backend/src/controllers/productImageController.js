import {
  getImagesByProductId,
  addImage,
  updateImage as updateImageService,
  deleteImage as deleteImageService
} from "../services/productImageService.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const getProductImages = catchAsync(async (req, res, next) => {
  const images = await getImagesByProductId(req.params.productId);
  res.status(200).json(images);
});

export const addProductImage = catchAsync(async (req, res, next) => {
  const image = await addImage(req.params.productId, req.body);
  res.status(201).json(image);
});

export const updateImage = catchAsync(async (req, res, next) => {
  const image = await updateImageService(req.params.id, req.body);
  if (!image) {
    return next(new AppError("Product image not found", 404));
  }
  res.status(200).json(image);
});

export const deleteImage = catchAsync(async (req, res, next) => {
  const image = await deleteImageService(req.params.id);
  if (!image) {
    return next(new AppError("Product image not found", 404));
  }
  res.status(204).send();
});
