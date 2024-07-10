// middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization || '';
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
  } catch (e) {
    console.error(e);
  }
  next();
};

module.exports = authMiddleware;
