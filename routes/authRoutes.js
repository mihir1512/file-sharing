const express = require("express");
const router = express.Router();

// const { authenticateUser } = require("../middleware/authentication");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);

module.exports = router;
