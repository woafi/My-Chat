// external imports
const express = require("express");

// internal imports
const { login, logout } = require("../controllers/loginController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

// set page title
const page_title = "Login";

// login page
router.get("/", decorateHtmlResponse(page_title), checkLogin );

// process login
router.post(
  "/",
  decorateHtmlResponse(page_title),
  login
);

// logout
router.delete("/", logout);

module.exports = router;
