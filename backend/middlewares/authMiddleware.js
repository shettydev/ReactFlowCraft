const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers["authorization"];
  // Check if the authorization header exists and starts with "Bearer"
  if (authHeader && authHeader.startsWith("Bearer")) {
    // Extract the token from the header
    const token = authHeader.split(" ")[1];
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Set req.user with the decoded user information
      req.user = decoded;
      next(); // Call the next middleware
    } catch (err) {
      res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
  }
};

module.exports = authMiddleware;
