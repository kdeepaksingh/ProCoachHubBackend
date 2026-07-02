import { Router } from "express";
import { uploadProfile } from "../config/multer";
import { validate } from "../middleware/validate.middleware";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
  resendOtpSchema,
  resetPasswordSchema,
  updateProfileSchema,
  verifyOtpSchema,
} from "../validations/auth.validation";
import {
  changePasswordHandler,
  forgotPasswordHandler,
  login,
  logout,
  profile,
  refresh,
  register,
  resendOtp,
  resetPasswordHandler,
  updateProfileHandler,
  verifyOtp,
} from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/register",
  uploadProfile.single("profileImage"),
  validate(registerSchema),
  register,
);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
// router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/resend-otp", validate(resendOtpSchema), resendOtp);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);
router.post("/logout", validate(refreshSchema), logout);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPasswordHandler,
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPasswordHandler,
);
router.get("/profile", requireAuth, profile);
router.patch(
  "/profile",
  requireAuth,
  uploadProfile.single("profileImage"),
  validate(updateProfileSchema),
  updateProfileHandler,
);
router.patch(
  "/change-password",
  requireAuth,
  validate(changePasswordSchema),
  changePasswordHandler,
);

export default router;
