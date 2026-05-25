const mongoose = require("mongoose");
const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    title: String,
    description: String,

    date: Date,
    startTime: String,
    endTime: String,

    type: {
      type: String,
      enum: [
        "DELIVERY",
        "MEETING",
        "SERVICE",
        "FOLLOW_UP",
        "PAYMENT",
        "OTHER",
      ],
      default: "OTHER",
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "FINISHED", "CANCELLED"],
      default: "PENDING",
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },

    responsible: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    location: {
      street: String,
      number: String,
      complement: String,
      neighborhood: String,
      city: String,
      state: String,
      zipCode: String,
    },

    contact: {
      name: String,
      phone: String,
      email: String,
    },

    notes: String,

    reminder: {
      enabled: {
        type: Boolean,
        default: false,
      },
      remindAt: Date,
    },

    completedAt: Date,
    cancelledAt: Date,
    cancelReason: String,
  },
  {
    timestamps: true,
  },
);

appointmentSchema.index({
  company: 1,
  date: 1,
  status: 1,
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;