const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "dev_secret";

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Missing Authorization header" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid Authorization format" });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, SECRET);
    // payload expected to contain at least `id`
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
