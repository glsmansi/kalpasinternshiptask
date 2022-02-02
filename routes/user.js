const express = require("express");
const router = express();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return res.status(409).send("User Already Exist. Please Login");
  }
  encryptedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: encryptedPassword,
  });
  const token = jwt.sign({ user_id: user._id, email }, process.env.JWT_SECRET);
  console.log(token);
  user.token = token;
  user.save();
  res.send(user);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.JWT_SECRET
      );
      console.log(user);
      user.token = token;
      user.save();
      res.send("loggedin successfully");
    } else {
      res.send("invalid password");
    }
  } else {
    return res.status(400).send({ error: "Invalid credentials" });
  }
});

module.exports = router;
