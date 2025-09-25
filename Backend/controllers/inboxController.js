// internal imports
const User = require("../models/People");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const escape = require("../utilities/escape");

// get inbox page
async function getInbox(req, res, next) {
  try {
    const conversations = await Conversation.find({
      $or: [
        { "creator.id": req.user.userid },
        { "participant.id": req.user.userid },
      ],
    });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "input invaild!",
        },
      },
    });
  }
}

// search user
async function searchUser(req, res, next) {
  const user = req.body.user;
  const searchQuery = user.replace("+88", "");

  const name_search_regex = new RegExp(escape(searchQuery), "i");
  const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
  const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");

  try {
    if (searchQuery !== "") {
      const users = await User.find(
        {
          $or: [
            {
              name: name_search_regex,
            },
            {
              mobile: mobile_search_regex,
            },
            {
              email: email_search_regex,
            },
          ],
        },
        "name avatar _id"
      );

      if (users.length !== 0) {
        res.status(200).json(users);
      } else {
        res.status(500).json({
          errors: {
            common: {
              msg: "User not found!",
            },
          },
        });
      }
    } else {
      res.status(500).json({
        errors: {
          common: {
            msg: "input invaild!",
          },
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

// add conversation
async function addConversation(req, res) {
  try {
    const newConversation = new Conversation({
      creator: {
        id: req.user.userid,
        name: req.user.username,
        avatar: req.user.avatar || null,
      },
      participant: {
        id: req.body.id,
        name: req.body.participant,
        avatar: req.body.avatar || null,
      },
    });

    await newConversation.save();
    res.status(200).json({
      message: "Conversation was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

//Delete Conversation
async function deleteConversation(req, res, next) {
  try {
    const conversation = await Conversation.findByIdAndDelete({
      _id: req.params.conversation_id,
    });

    await Message.deleteMany({
      conversation_id: req.params.conversation_id,
    });

    res.status(200).json({
      message: "Conversation was deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknows error occured!",
        },
      },
    });
  }
}

//get messages of a conversation
async function getMessages(req, res) {
  try {
    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
    }).sort("-createdAt");

    const { participant } = await Conversation.findById(
      req.params.conversation_id
    );

    res.status(200).json({
      data: {
        messages: messages,
        participant,
      },
      user: req.user.userid,
      conversation_id: req.params.conversation_id,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknows error occured!",
        },
      },
    });
  }
}

//send new message
async function sendMessage(req, res) {
  if (req.body.message) {
    try {
      // Validate required fields
      if (!req.body.conversationId || !req.body.receiverId) {
        return res.status(400).json({
          errors: {
            common: "Conversation ID and Receiver ID are required!"
          }
        });
      }
      const newMessage = new Message({
        text: req.body.message,
        attachment: req.body.attachment || null,
        sender: {
          id: req.user.userid,
          name: req.user.username,
          avatar: req.user.avatar || null,
        },
        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: req.body.avatar || null,
        },
        conversation_id: req.body.conversationId,
        seen: false, // Mark new messages as unseen by default
      });

      const result = await newMessage.save();

      // Prepare message data for socket emission
      const messageData = {
        _id: result._id,
        conversation_id: req.body.conversationId,
        sender: {
          id: req.user.userid,
          name: req.user.username,
          avatar: req.user.avatar || null,
        },
        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: req.body.avatar || null,
        },
        text: req.body.message,
        attachment: req.body.attachment,
        createdAt: result.createdAt || result.date_time,
        timestamp: result.timestamp || result.date_time
      };



      // 1. Emit to conversation room (for all participants)
      global.io.to(`conversation_${req.body.conversationId}`).emit("new_message", {
        message: messageData
      });

      // 2. Emit to sender's personal room (for sender's other devices/tabs)
      global.io.to(`user_${req.user.userid}`).emit("new_message", {
        message: messageData
      });

      // 3. Emit to receiver's personal room (for receiver's devices/tabs)
      global.io.to(`user_${req.body.receiverId}`).emit("new_message", {
        message: messageData
      });

      res.status(200).json({
        message: "Message sent successfully!",
        data: result,
      });
    } catch (err) {
      console.error('Send message error:', err);
      res.status(500).json({
        errors: {
          common: {
            msg: err.message,
          },
        },
      });
    }
  } else {
    res.status(400).json({
      errors: {
        common: "Message text is required!",
      },
    });
  }
}

module.exports = {
  getInbox,
  searchUser,
  addConversation,
  deleteConversation,
  getMessages,
  sendMessage,
};
