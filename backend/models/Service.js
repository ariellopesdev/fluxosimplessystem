const mongoose = require("mongoose");
const { Schema } = mongoose;

const serviceSchema = new Schema(
  {
    name: String,
    description: String,

    unityPrice: Number,

    estimatedDuration: {
      value: Number,
      unit: {
        type: String,
        enum: ["MINUTES", "HOURS", "DAYS"],
        default: "HOURS",
      },
    },

    category: {
      type: String,
      enum: [
        "SERVICE",
        "CONSULTATION",
        "INSTALLATION",
        "MAINTENANCE",
        "DELIVERY",
        "SUPPORT",
        "OTHER",
      ],
      default: "SERVICE",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    isSchedulable: {
      type: Boolean,
      default: true,
    },

    isSellable: {
      type: Boolean,
      default: true,
    },

    requiresClient: {
      type: Boolean,
      default: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    cnpj: String,

    notes: String,
  },
  {
    timestamps: true,
  },
);

serviceSchema.index(
  {
    name: 1,
    cnpj: 1,
  },
  {
    unique: true,
  },
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;