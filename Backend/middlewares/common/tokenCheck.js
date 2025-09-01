const jwt = require("jsonwebtoken");

const tokenCheck = (req, res) => {
    const token = req.params.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.status(200).json({
                isAuthenticated: true,
                user: decoded
            });
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
    tokenCheck,
};