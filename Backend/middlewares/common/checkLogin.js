const jwt = require("jsonwebtoken");

// auth guard to protect routes that need authentication
const checkLogin = (req, res, next) => {
  const cookies = req.signedCookies;
  if (cookies && cookies[process.env.COOKIE_NAME]) {
    try {
      const token = cookies[process.env.COOKIE_NAME];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //for using next middleware
      req.user = decoded;
      const nextRespone = res.locals.next || null;

      if (nextRespone) {
        next();
      } else {
        res.status(200).json({
          isAuthenticated: true,
          user: decoded
        });
      }
    } catch (err) {
      console.error('JWT verification error:', err);
      res.status(401).json({
        isAuthenticated: false,
        error: "Invalid token"
      });
    }
  } else {
    res.status(401).json({
      isAuthenticated: false,
      error: "No authentication token found"
    });
  }
};

module.exports = {
  checkLogin,
};
