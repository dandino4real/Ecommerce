const router = require("express").Router();
const { User } = require("../models/User");

//Register a user
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    if (newUser) {
      const savedUser = await newUser.save();
      res.status(201).json({ user: savedUser });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
