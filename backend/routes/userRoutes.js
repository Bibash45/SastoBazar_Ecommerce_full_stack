import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserByID,
  deleteUser,
  updateUser,
  googleLogin,
  verifyUserCode,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.route("/verifycode").post(verifyUserCode);
router.route("/resendcode").post(resendVerificationCode);

router.route("/google-login").post(googleLogin);
router.post("/logout", logoutUser);

router.post("/auth", authUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserByID)
  .put(protect, admin, updateUser);

export default router;
