const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    req.isAuth = false;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.isAuth = true;
    req.userId = decoded.user.id;
    next();
  } catch (err) {
    req.isAuth = false;
    return next();
  }
};
