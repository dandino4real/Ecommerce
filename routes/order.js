const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
  verifyToken,
} = require("../middleware/verifyToken");
const { Order } = require("../models/Order");

const router = require("express").Router();

// CREATE Order

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
   
    res.status(200).json({ msg: "Order created succesfully", savedOrder });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// UPDATE Order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    return res.status(200).json(updatedOrder);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE Order

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order deleted successfully");
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//  GET USER Order

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.userId });
    res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//  GET ALL ORDERS

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const Orders = await Order.find();
    res.status(200).json(Order);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
        {$match : {createdAt : {$gte : previousMonth}}},
        {$project : {month: {$month : "$createdAt"}, sales: "$amount"}},
        {$group : {_id: "$month", total:{$sum : "$sales"}}}
    ])

    res.status(200).json(income)

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
