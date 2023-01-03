const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

/**
 * @route POST /auth/login
 * @description Log in with username and password
 * @access Public
 */
router.post(
  "/login",
  authController.loginWithEmail
);

module.exports = router;