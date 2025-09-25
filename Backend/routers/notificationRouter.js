// external imports
const express = require("express");

// internal imports
const {
  getUnreadMessages,
  markMessageAsSeen,
  markMessagesAsSeen,
  markAllAsSeen
} = require("../controllers/notificationController");
const { checkLogin } = require("../middlewares/common/checkLogin");
const nextRespone = require("../middlewares/common/nextRespone");

const router = express.Router();

// Get all unread messages for the current user
router.get("/unread", nextRespone(true), checkLogin, getUnreadMessages);

// Mark a specific message as seen
router.patch("/:messageId/seen", nextRespone(true), checkLogin, markMessageAsSeen);

// Mark multiple messages as seen
router.patch("/mark-seen", nextRespone(true), checkLogin, markMessagesAsSeen);

// Mark all messages as seen for the current user
router.patch("/mark-all-seen", nextRespone(true), checkLogin, markAllAsSeen);

module.exports = router;