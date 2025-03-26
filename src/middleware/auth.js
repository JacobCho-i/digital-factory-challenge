const jwt = require('jsonwebtoken');
const secret = "DMXSdlv9wHHiV+bBPAb5KA==";

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('No token');

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).send(`Invalid token ${err}`);
  }
}

module.exports = auth;
