const jwt = require('jsonwebtoken');

const protectAdmin = (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.role !== 'admin' || decoded.email !== process.env.ADMIN_EMAIL) {
      res.status(401);
      throw new Error('Not authorized');
    }
    req.admin = { email: decoded.email };
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
};

module.exports = { protectAdmin };
