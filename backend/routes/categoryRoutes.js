import express from "express";
import {
  testFunction,
  postCategory,
  categoryList,
  categoryDetails,
  updateCategory,
  deleteCategory,
  allCategoryList,
} from "../controllers/categoryController.js";

import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

const router = express.Router();

router.get("/demo", testFunction);

router.post("/postcategory", protect, admin, postCategory);
router.get("/categorylist", categoryList);
router.get("/categorydetails/:id", categoryDetails, checkObjectId);
router.put(
  "/updatecategory/:id",
  protect,
  admin,
  checkObjectId,
  updateCategory
);
router.delete(
  "/deletecategory/:id",
  protect,
  admin,
  checkObjectId,
  deleteCategory
);

router.get("/allcategory", allCategoryList);

export default router;
