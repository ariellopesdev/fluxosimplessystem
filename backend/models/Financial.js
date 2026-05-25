const mongoose = require("mongoose");
const { Schema } = mongoose;

const financialSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    description: String,

    type: {
      type: String,
      enum: ["INCOME", "EXPENSE", "ASSET"],
    },

    category: {
      type: String,
      enum: [
        "SALE",
        "PRODUCT_PURCHASE",
        "PRODUCT_ASSET",
        "COMPANY_ASSET",
        "MAINTENANCE",
        "TAX",
        "SALARY",
        "RENT",
        "UTILITY",
        "OTHER",
      ],
      default: "OTHER",
    },

    amount: {
      type: Number,
      min: 0,
    },

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
        enum: ["PENDING", "PAID", "CANCELLED"],
        default: "PENDING",
      },

      installments: {
        type: Number,
        default: 1,
      },

      paidAt: Date,
      dueDate: Date,
    },

    origin: {
      sale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sale",
      },

      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },

      client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
      },
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    notes: String,

    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurrence: {
      frequency: {
        type: String,
        enum: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY", "NONE"],
        default: "NONE",
      },

      nextDate: Date,
    },
  },
  {
    timestamps: true,
  },
);

financialSchema.index({
  company: 1,
  type: 1,
  category: 1,
  createdAt: -1,
});

const Financial = mongoose.model("Financial", financialSchema);

module.exports = Financial;