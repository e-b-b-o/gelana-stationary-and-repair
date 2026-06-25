import {
  createNewCategory,
  getAllCategories,
  getCategoryById,
  updateExistingCategory,
  deleteCategory as deleteCategoryService,
} from "../services/categoriesService.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const getCategories = catchAsync(async (req, res, next) => {
  const categories = await getAllCategories();
  res.status(200).json(categories);
});

export const getCategory = catchAsync(async (req, res, next) => {
  const category = await getCategoryById(req.params.id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  res.status(200).json(category);
});

export const createCategory = catchAsync(async (req, res, next) => {
  const category = await createNewCategory(req.body);
  res.status(201).json(category);
});

export const updateCategory = catchAsync(async (req, res, next) => {
  const category = await updateExistingCategory(req.params.id, req.body);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  res.status(200).json(category);
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  const category = await deleteCategoryService(req.params.id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  res.status(204).send();
});
