// routes/Auth/ForgotRoutes.js
import express from "express";
import { forgotPassword, verifyOTP, resetPassword } from "../../controllers/Auth/ForgotController.js";

const router = express.Router();

// CHỈ VIẾT THẾ NÀY THÔI (Bỏ /api/auth đi)
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;