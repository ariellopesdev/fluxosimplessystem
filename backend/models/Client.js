const mongoose = require("mongoose");
const { Schema } = mongoose;

const clientSchema = new Schema(
  {
    name: String,
    email: String,
    phones: {
      primary: {
        type: String,
      },
      secondary: String,
      emergency: String,
    },
    cpfCnpj: String,
    address: {
      street: String,
      number: String,
      neighborhood: String,
      city: String,
      state: String,
      zipCode: String,
    },
    type: {
      type: String,
      enum: ["PERSON", "COMPANY"],
      default: "PERSON",
    },
    notes: String,
    financial: {
      type: String,
      enum: ["CANCELLED", "ACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

clientSchema.index(
  {
    cpfCnpj: 1,
  },
  {
    unique: true,
    sparse: true,
  },
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
