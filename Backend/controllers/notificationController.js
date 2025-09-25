const Message = require("../models/Message");

// Get all unread messages for the current user
async function getUnreadMessages(req, res) {
  try {
    const messages = await Message.find({
      "receiver.id": req.user.userid,
      "sender.id": { $ne: req.user.userid },
      seen: false
    }).sort("-createdAt");

    res.status(200).json({
      messages: messages
    });
  } catch (err) {
    console.error('Error fetching unread messages:', err);
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occurred!",
        },
      },
    });
  }
}

// Mark a specific message as seen
async function markMessageAsSeen(req, res) {
  try {
    const messageId = req.params.messageId;
    
    const message = await Message.findByIdAndUpdate(
      messageId,
      { seen: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        errors: {
          common: {
            msg: "Message not found!",
          },
        },
      });
    }

    res.status(200).json({
      message: "Message marked as seen",
      data: message,
    });
  } catch (err) {
    console.error('Error marking message as seen:', err);
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occurred!",
        },
      },
    });
  }
}

// Mark multiple messages as seen
async function markMessagesAsSeen(req, res) {
  try {
    const { messageIds } = req.body;
    
    if (!messageIds || !Array.isArray(messageIds)) {
      return res.status(400).json({
        errors: {
          common: {
            msg: "Message IDs array is required!",
          },
        },
      });
    }

    const result = await Message.updateMany(
      { _id: { $in: messageIds } },
      { seen: true }
    );

    res.status(200).json({
      message: `${result.modifiedCount} messages marked as seen`,
    });
  } catch (err) {
    console.error('Error marking messages as seen:', err);
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occurred!",
        },
      },
    });
  }
}

// Mark all messages as seen for the current user
async function markAllAsSeen(req, res) {
  try {
    const result = await Message.updateMany(
      {
        "receiver.id": req.user.userid,
        seen: false
      },
      { seen: true }
    );

    res.status(200).json({
      message: `${result.modifiedCount} messages marked as seen`,
    });
  } catch (err) {
    console.error('Error marking all messages as seen:', err);
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occurred!",
        },
      },
    });
  }
}

module.exports = {
  getUnreadMessages,
  markMessageAsSeen,
  markMessagesAsSeen,
  markAllAsSeen
};