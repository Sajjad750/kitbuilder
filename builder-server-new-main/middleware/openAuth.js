const jwt = require('jsonwebtoken');
// const config = require('config');

module.exports = function (req, res, next) {
  const adminToken = req.header('x-auth-token');
  const retailerToken = req.header('x-retailer-auth-token');

  // Check if either token is present
  if (!adminToken && !retailerToken) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    let decoded;
    let privateKey;
    if (adminToken) {
      // privateKey = config.get('jwtPrivateKey');
      decoded = jwt.verify(adminToken, "jwtPrivateKey");
      if (decoded.isAdmin) {
        req.user = decoded;
        return next();
      }
    }

    if (retailerToken) {
      privateKey = "jwtPrivateKey";
      decoded = jwt.verify(retailerToken, privateKey);
      if (decoded.isRetailer) {
        req.user = decoded;
        return next();
      }
    }
    // If neither token is valid for the requested route
    res.status(403).send('Access denied.');
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
}
