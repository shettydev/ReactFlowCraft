const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken"); // Add JWT library
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const bcrypt = require("bcrypt");
const authMiddleware = require("../middlewares/authMiddleware")


// Require User Model
const User = require("../models/User");

// Use passport-local configuration Create passport local Strategy
passport.use(User.createStrategy());

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      // if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));


// Serialize and deserialize are only necessary when using session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
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
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    // Check if the provided email is valid
    if (!isValidEmail(req.body.username)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Salt rounds: 10

    // Create a new user instance with hashed password
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword // Save the hashed password
    });

    // Save the user to the database
    await newUser.save();

    const token = generateToken(newUser);
    res.status(200).json({ message: "User registered successfully.", token: token, userId: newUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
});


function isValidEmail(email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}


// Local route Login user
router.post("/auth/login", (req, res) => {

  if (req.isAuthenticated()) {
    const token = generateToken(req.user);
    return res.status(200).json({ message: "User is already logged in.", token: token, userId: req.user._id });
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
        // Retrieve the updated user
        User.findOne({ username: req.body.username }, async (err, updatedUser) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
          }
          const token = generateToken(req.user);
          res.status(200).json({ message: "Login successful.", token: token, userId: updatedUser._id });
        });
      });
    }
  });
});

// Logout user
router.get("/auth/logout", authMiddleware, (req, res) => {
  // use passport logout method to end user session and unauthenticate it
  try {
    req.logout();
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.log(err);
    res.status(500).json({ error: "Internal server error." });
  }

});

// Export router
module.exports = router;
