const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgetPassword", authController.forgetPassword);
router.get("/me", authenticateToken, authController.me);

module.exports = router;
