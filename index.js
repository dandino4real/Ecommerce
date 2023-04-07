const express = require("express");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/products");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/carts");
const stripeRoute = require("./routes/stripe");
const cors = require("cors")
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();



//database connection

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connection succesful"))
  .catch((err) => console.log(err));


  //middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/carts", cartRoute);
app.use("/api/checkout", stripeRoute);





const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Backend Server running on port ${port}...`);
});
