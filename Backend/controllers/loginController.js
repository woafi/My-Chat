// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// internal imports
const User = require("../models/People");

// do login
async function login(req, res, next) {
  try {
    // find a user who has this email/username
    const user = await User.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });

    if (user && user._id) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (isValidPassword) {
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
          message: "login successfully!",
        });
      } else {
        res.status(404).json({
          errors: {
            common: {
              msg: "Wrong password! Please try again",
            },
          },
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
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Login failed! Please try again",
        },
      },
    });
  }
}

// do logout
function logout(req, res) {
  try {
    res.clearCookie(process.env.COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      signed: true,
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
}

module.exports = {
  login,
  logout,
};
