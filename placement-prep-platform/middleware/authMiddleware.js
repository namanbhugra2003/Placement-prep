// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Middleware - token:", token);

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Middleware - decoded user:", decoded);
    return next();
  } catch (err) {
    console.log("Middleware - token invalid:", err.message);
    return res.status(401).json({ message: "Token is not valid" });
  }
};
