const authMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        // User is authenticated, allow access to the next middleware
        return next();
    } else {
        // User is not authenticated, send an error response
        return res.status(401).json({ error: "Authentication required" });
    }
};

module.exports = authMiddleware;
