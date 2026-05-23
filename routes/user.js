const express = require("express");
const router = express.Router();
const User = require("../models/user")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")

const userController = require("../controllers/users.js")

// signup route
router.route("/signup")
  .get(userController.rendersignup)
  .post(wrapAsync(userController.signup))

// Login route
router.route("/login")
  .get(userController.renderlogin)
  .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login)

// logout route
router.get("/logout", userController.logout)

module.exports = router;