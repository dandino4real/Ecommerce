const express = require("express");
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();

//middleware
app.use(express.json())
app.use(express.urlencoded({extended : false}))

//database connection

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connection succesful"))
  .catch((err) => console.log(err));

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)


const port = process.env.PORT || 5000;

app.listen( port, () => {
  console.log(`Backend Server running on port ${port}...`);
});
