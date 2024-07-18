const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  console.log('Authorization Header:', authHeader); // Log the auth header
  if (!authHeader) {
    req.isAuth = false;
    console.log('No Authorization header. Unauthenticated.');
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (!token || token === '') {
    req.isAuth = false;
    console.log('No token provided. Unauthenticated.');
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretkey');
    console.log('Decoded Token:', decodedToken); // Log the decoded token
  } catch (err) {
    req.isAuth = false;
    console.log('Token verification failed. Unauthenticated.');
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    console.log('No decoded token. Unauthenticated.');
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  console.log('Authenticated. User ID:', req.userId);
  next();
};
