const { Schema , model} = require("mongoose");

const ProductSchema = Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    categories: { type: Array },
    size: { type: String },
    colour: { type: String },
    price: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports.Product  = model("product", ProductSchema);
