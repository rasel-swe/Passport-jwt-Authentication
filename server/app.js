const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./models/user.model");
const saltRounds = 10;
require("dotenv").config();
require("./config/database");
const jwt = require("jsonwebtoken");
const app = express();
const passport = require("passport");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

require("./config/passport");

//register route

app.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).send("User already registered");
    }
    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
      const newUser = new User({
        username: req.body.username,
        password: hash,
      });

      await newUser
        .save()
        .then((user) => {
          res.send({
            success: true,
            message: "User registered successfully",
            user: {
              id: user._id,
              username: user.username,
            },
          });
        })
        .catch((err) => {
          res.send({
            success: false,
            message: "user registration failed",
            error: err,
          });
        });
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//login module

app.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user)
    return res.status(401).send({
      success: false,
      message: "Invalid username",
    });

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).send({
      success: false,
      message: "Incorrect password",
    });
  }
  const payload = {
    id: user._id,
    username: user.username,
  };
  const token = jwt.sign(payload, process.env.secretOrPrivateKey, {
    expiresIn: "2d",
  });
  return res.status(200).send({
    success: true,
    message: "Successfully logged in",
    token: "Bearer " + token,
  });
});

//protected route

app.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    res.status(200).send({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
      },
    });
  }
);

//Home route
app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

//route error handler

app.use((req, res, next) => {
  res.status(404).json({
    message: "Invalid request",
  });
});

//server error handler

app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Server is broken",
  });
});
module.exports = app;
