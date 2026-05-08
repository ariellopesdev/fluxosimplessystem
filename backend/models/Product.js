const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: String,
    description: String,
    price: Number,
    productImage: String,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    cnpj: String,
  },
  {
    timestamps: true,
  },
);

productSchema.index(
  {
    name: 1,
    cnpj: 1,
  },
  {
    unique: true,
  },
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
