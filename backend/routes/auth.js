// Require express router, passport, passport-google-oauth20, passport-facebook
const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken"); // Add JWT library

// Require User Model
const User = require("../models/User");

// Use passport-local configuration Create passport local Strategy
passport.use(User.createStrategy());

// Serialize and deserialize are only necessary when using session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Function to generate JWT token
function generateToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

// Local route Register new user
router.post("/auth/register", async (req, res) => {
  try {
    // Register User
    const registerUser = await User.register(
      { username: req.body.username },
      req.body.password
    );
    if (registerUser) {
      // if user registered, we will authenticate the user using passport
      passport.authenticate("local")(req, res, function() {
        res.status(200).json({ message: "User registered successfully." });
      });
    } else {
      res.status(400).json({ error: "User registration failed." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Local route Login user
router.post("/auth/login", (req, res) => {
  
  if (req.isAuthenticated()) {
    return res.status(200).json({ message: "User is already logged in." });
  }
  // login using the created user
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  // use passport login method to check if user credentials true and authenticate it
  req.login(user, (err) => {
    if (err) {
      console.log(err);
      res.status(401).json({ error: "Authentication failed." });
    } else {
      passport.authenticate("local")(req, res, () => {
        res.status(200).json({ message: "Login successful." });
      });
    }
  });
});

// Logout user
router.get("/auth/logout", (req, res) => {
  // use passport logout method to end user session and unauthenticate it
  req.logout();
  res.status(200).json({ message: "Logout successful." });
});

// Export router
module.exports = router;
