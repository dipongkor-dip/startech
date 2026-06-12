import {Router} from "express";
import {categoryController} from "./categories.controller";

const route = Router();
// public routes
route.get("/", categoryController.getAllCategories);
route.get("/:id", categoryController.getCategoryById);

// protected routes
route.post("/", categoryController.createCategory);
route.patch("/status/:id", categoryController.updateStatus);
route.patch("/sequence", categoryController.updateSequence);
route.patch("/:id", categoryController.updateCategory);
route.delete("/:id", categoryController.deleteCategory);

export const CategoryRoute = route;
