const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('No token');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).send(`Invalid token ${err}`);
  }
}

module.exports = auth;
