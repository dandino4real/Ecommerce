const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const CryptoJS = require("crypto-js");
const { User } = require("../models/User");

// update

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  //   if (req.body.password) {
  //     req.body.password = CryptoJS.AES.encrypt(
  //       req.body.password,
  //       process.env.SECRET
  //     ).toString();
  //   }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//delete user

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("user deleted successfully");
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//  Get single user

router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user;
    res.status(200).json(others);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//  Get all users

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(1)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//  Get users stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: { month: { $month: "$createdAt" } },
      },
      {
        $group: { _id: "$month", total: { $sum: 1 } }
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});



  
module.exports = router;
