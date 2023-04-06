const router = require("express").Router();
const { User } = require("../models/User");
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

//Register a user
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET).toString()
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


//Login a user

router.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(401).json({ message: 'Wrong credentials' });
      }
      const storedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET
      )
      const originalPassword = storedPassword.toString(CryptoJS.enc.Utf8)
      
      if (originalPassword !== req.body.password) {
        return res.status(401).json({ message: 'Wrong credentials' });
      }
  
      const accessToken = jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin
      }, process.env.JWT_SECRET, {expiresIn: "1d"})

      const {password, ...others} = user._doc
      return res.status(200).json({...others, accessToken}) ;
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
module.exports = router;
