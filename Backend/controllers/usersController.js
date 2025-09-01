// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// internal imports
const User = require("../models/People");
const sendVerificationEmail = require('../utilities/sendVerification');

// get users page
async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json({
      users,
    })
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured!",
        },
      },
    });
  }
}

// add user
async function addUser(req, res) {
  if (!req.body) {
    return res.status(400).json({
      errors: {
        common: {
          msg: 'Invalid request body',
        },
      },
    });
  }

  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  delete req.body.confirmPassword;
  newUser = new User({
    ...req.body,
    password: hashedPassword,
  });
  // save user or send error
  try {
    const result = await newUser.save();
    // prepare the user object to generate token
    const userObject = {
      userid: result._id,
      username: result.name,
      email: result.email,
      avatar: result.avatar || null,
      role: result.role || "user",
      phoneNumber: result.mobile,
    };

    // generate token
    const token = jwt.sign(userObject, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    // set cookie
    res.cookie(process.env.COOKIE_NAME, token, {
      maxAge: process.env.JWT_EXPIRY,
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      signed: true,
    });

    res.status(200).json({
      message: "User was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured!",
        },
      },
    });
  }
}

//update user
async function updateUser(req, res) {
  const { avatarUrl } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.params.id, },
      { $set: { avatar: avatarUrl } },
      { new: true, runValidators: true });


    if (updatedUser) {
      const userObject = {
        userid: updatedUser._id,
        username: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar || null,
        role: updatedUser.role || "user",
        phoneNumber: updatedUser.mobile,
      };

      // generate token
      const token = jwt.sign(userObject, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
      });

      // set cookie
      res.cookie(process.env.COOKIE_NAME, token, {
        maxAge: process.env.JWT_EXPIRY,
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        signed: true,
      });

      res.status(200).json({
        message: "Profile picture was updated successfully!",
      });
    }

  } catch (error) {
    console.error("Error updating user:", error);

    // Handle different types of errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        errors: {
          common: {
            msg: "Validation error!",
          },
        },
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        errors: {
          common: {
            msg: "Invalid user ID format!",
          },
        },
      });
    }

    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        errors: {
          common: {
            msg: "Invalid token!",
          },
        },
      });
    }

    // Generic server error
    res.status(500).json({
      errors: {
        common: {
          msg: "Internal server error!",
        },
      },
    });
  }
}

// remove user
async function removeUser(req, res) {
  try {
    const user = await User.findByIdAndDelete({
      _id: req.params.id,
    });

    res.status(200).json({
      message: "User was removed successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user!",
        },
      },
    });
  }
}

//ForgetPassword
async function forgetPassword(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && user._id) {
      // prepare the user object to generate token
      const userObject = {
        userid: user._id,
        username: user.name,
        email: user.email,
        avatar: user.avatar || null,
        role: user.role || "user",
        phoneNumber: user.mobile,
      };

      // generate token
      const token = jwt.sign(userObject, process.env.JWT_SECRET, {
        expiresIn: 300,
      });

      sendVerificationEmail(user.email, token);
      res.status(200).json({
        message: "Password reset email sent successfully!",
      });
    } else {
      res.status(404).json({
        errors: {
          common: {
            msg: "Sorry, we don't recognize this user.",
          },
        },
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      errors: {
        common: {
          msg: "Error processing password reset request",
        },
      },
    });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findOne({ email: user.email });

    if (currentUser && currentUser._id) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await User.findByIdAndUpdate(
        { _id: currentUser._id, },
        { $set: { password: hashedPassword } },
        { new: true, runValidators: true });

      if (updatedUser) {
        res.status(200).json({
          message: "Password reset successfully!",
        });
      }
    } else {
      res.status(404).json({
        errors: {
          common: {
            msg: "Sorry, we don't recognize this user.",
          },
        },
      });
    }
  } catch (error) {
    console.log(error)
    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        errors: {
          common: {
            msg: "Invalid token!",
          },
        },
      });
    }
  }
}

module.exports = {
  getUsers,
  addUser,
  removeUser,
  updateUser,
  forgetPassword,
  resetPassword
};
