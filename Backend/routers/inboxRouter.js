// external imports
const express = require("express");

// internal imports
const {
  getInbox,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
  deleteConversation,
} = require("../controllers/inboxController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const nextRespone = require("../middlewares/common/nextRespone");
const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

// inbox page
router.get("/", decorateHtmlResponse("Inbox"), nextRespone(true), checkLogin, getInbox);

// search user for conversation
router.post("/search", searchUser);

// add conversation
router.post("/conversation", nextRespone(true), checkLogin, addConversation);

//
router.delete("/conversation/:conversation_id", nextRespone(true), checkLogin, deleteConversation)

// get messages of a conversation
router.get("/messages/:conversation_id", nextRespone(true), checkLogin, getMessages);

// send message
router.post("/message", nextRespone(true), checkLogin, sendMessage);

module.exports = router;
