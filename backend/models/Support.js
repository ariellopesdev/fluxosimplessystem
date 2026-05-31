const mongoose = require("mongoose");
const { Schema } = mongoose;

const supportMessageSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    senderName: String,
    senderEmail: String,

    senderRole: {
      type: String,
      enum: ["USER", "ADMIN", "SUPER_ADMIN", "SYSTEM"],
      default: "USER",
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    readByAdmin: {
      type: Boolean,
      default: false,
    },

    readByUser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const supportSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "ACCOUNT",
        "PRODUCTS",
        "CLIENTS",
        "SERVICES",
        "APPOINTMENTS",
        "FINANCIAL",
        "REPORTS",
        "DASHBOARD",
        "SETTINGS",
        "BUG",
        "OTHER",
      ],
      default: "OTHER",
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },

    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "ANSWERED", "CLOSED"],
      default: "OPEN",
    },

    messages: [supportMessageSchema],

    openedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    cnpj: String,

    lastMessageAt: Date,
    closedAt: Date,
  },
  {
    timestamps: true,
  },
);

supportSchema.index({
  company: 1,
  status: 1,
  createdAt: -1,
});

supportSchema.index({
  openedBy: 1,
  createdAt: -1,
});

const Support = mongoose.model("Support", supportSchema);

module.exports = Support;