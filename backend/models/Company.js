const mongoose = require("mongoose");
const { Schema } = mongoose;

const companySchema = new Schema(
  {
    name: String,
    cnjp: String,
  },
  {
    timestamps: true,
  },
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
