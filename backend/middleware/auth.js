const authService = require('../services/authService');

/**
 * Express middleware to verify JWT token from Authorization header.
 * Attaches decoded user info to req.user if token is valid.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    const user = authService.verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    return res.sendStatus(403); // Forbidden
  }
}

module.exports = authenticateToken;