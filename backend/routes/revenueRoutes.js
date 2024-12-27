import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getMonthlyRevenue,
  getRevenue,
  topSellingProducts,
} from "../controllers/revenueController.js";

const router = express.Router();

router.route("/revenue").get(protect, admin, getRevenue);
router.route("/revenue/monthly").get(protect, admin, getMonthlyRevenue);
router.route("/top-selling-products").get(protect, admin, topSellingProducts);

export default router;
