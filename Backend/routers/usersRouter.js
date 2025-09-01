// external imports
const express = require("express");

// internal imports
const {
  getUsers,
  addUser,
  removeUser,
  updateUser,
  forgetPassword,
  resetPassword
} = require("../controllers/usersController");

const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middlewares/users/userValidators");

const nextRespone = require("../middlewares/common/nextRespone");
const { checkLogin } = require("../middlewares/common/checkLogin");
const { tokenCheck } = require("../middlewares/common/tokenCheck");

const router = express.Router();

// users page
router.get(
  "/",
  getUsers
);

// add user
router.post(
  "/",
  addUserValidators,
  addUserValidationHandler,
  addUser
);

// remove user
router.delete("/:id", nextRespone(true), checkLogin, removeUser);

// Update User's Information
router.put("/update/:id", updateUser);

//Forget Password
router.post("/forgot-password", forgetPassword);
router.post("/api/auth/reset-password", resetPassword);

//token check for resetpassword
router.get("/:token", tokenCheck)

module.exports = router;
