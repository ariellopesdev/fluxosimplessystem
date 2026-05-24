const mongoose = require("mongoose");
const { Schema } = mongoose;

const saleSchema = new Schema(
  {
    saleNumber: String,
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        quantity: {
          type: Number,
          min: 1,
        },
        unityPrice: {
          type: Number,
          min: 0,
        },
        totalPrice: {
          type: Number,
          min: 0,
        },
      },
    ],
    payment: {
      method: {
        type: String,
        enum: [
          "CASH",
          "PIX",
          "CREDIT_CARD",
          "DEBIT_CARD",
          "BANK_SLIP",
          "TRANSFER",
        ],
        default: "PIX",
      },
      status: {
        type: String,
        enum: ["PENDING", "PAID", "CANCELLED", "REFUNDED"],
        default: "PENDING",
      },
      installments: {
        type: Number,
        default: 1,
      },
    },
    subtotal: Number,
    discount: Number,
    shipping: Number,
    total: {
      type: Number,
      default: 0,
    },
    notes: String,
    status: {
      type: String,
      enum: ["OPEN", "FINISHED", "CANCELLED"],
      default: "OPEN",
    },
  },
  {
    timestamps: true,
  },
);

saleSchema.index(
  {
    saleNumber: 1,
  },
  {
    unique: true,
  },
);

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;
