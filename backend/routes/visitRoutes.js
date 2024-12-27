import express from "express";
import { monthlyVisit } from "../controllers/visitController.js";

const router = express.Router();

router.route("/monthly").get(monthlyVisit);

export default router;
