const { verifyToken } = require('../helpers/jwt');
const pool = require('../database');

exports.authentication = (req, res, next) => {
  try {
    const token = req.get("token");

    if (!token) {
      throw {
        error: "Unauthorized",
        message: "Please login first",
      };
    }

    const decoded = verifyToken(token);
    
    pool.query('SELECT * FROM Users WHERE email = ? AND username = ?', [decoded.email, decoded.username], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          error: "Internal Server Error",
          message: "Error retrieving user information",
        });
      }

      const user = results[0];

      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      res.locals.user = user;
      return next();
    });

  } catch (err) {
    return res.status(401).json(err);
  }
};