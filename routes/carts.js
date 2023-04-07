const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middleware/verifyToken");
const { Cart } = require("../models/Cart");

const router = require("express").Router();

// CREATE Cart

router.post("/", verifyTokenAndAuthorization, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json({ msg: "Cart created succesfully", savedCart });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// UPDATE Cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    return res.status(200).json(updatedCart);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE Cart

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart deleted successfully");
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//  GET USER CART

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const Cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(Cart);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//  GET ALL CartS

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(Cart);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
