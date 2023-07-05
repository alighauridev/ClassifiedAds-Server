import categoryController from "../controllers/categoryController.js";

import { Router } from "express";

const router = Router();


// categories controllers
router.get("/categories", categoryController.getCategories);
router.get("/categories/all", categoryController.getRecentCategories);
router.get("/categories/:id", categoryController.getCategory);
router.post("/categories", categoryController.createCategory);
router.delete("/categories/:id", categoryController.deleteCategory);
router.patch("/categories/:id", categoryController.updateCategory);
// subcategories controller
router.get("/categories/:id/subcategories", categoryController.getSubcategory);
router.post(
    "/categories/:id/subcategories",
    categoryController.createSubcategory
);
router.delete(
    "/categories/:id/subcategories",
    categoryController.deleteSubcategory
);
router.get(
    "/categories-with-subcategories",
    categoryController.getCategoriesWithSubcategories
);
// ... other routes



export default router;
