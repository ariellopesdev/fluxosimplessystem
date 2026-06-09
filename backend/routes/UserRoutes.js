const express = require("express");
const router = express.Router();

// Controller
const {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
  forgotPassword,
  resetPassword,
} = require("../controllers/UserController");

// Middlewares
const validate = require("../middlewares/handleValidation");
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../middlewares/userValidations");
const authGuard = require("../middlewares/authGuard");
const roleGuard = require("../middlewares/roleGuard");
const { imageUpload } = require("../middlewares/imageUpload");
const {
  loginLimiter,
  forgotPasswordLimiter,
} = require("../middlewares/rateLimiters");

// Routes
router.post(
  "/register",
  authGuard,
  roleGuard("SUPER_ADMIN", "ADMIN"),
  userCreateValidation(),
  validate,
  register,
);
router.post("/login", loginLimiter, loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentUser);
router.put(
  "/",
  authGuard,
  userUpdateValidation(),
  validate,
  imageUpload.single("profileImage"),
  update,
);
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  forgotPasswordValidation(),
  validate,
  forgotPassword,
);
router.put(
  "/reset-password/:token",
  resetPasswordValidation(),
  validate,
  resetPassword,
);
router.get("/:id", getUserById);

module.exports = router;
