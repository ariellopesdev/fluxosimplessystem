const mongoose = require("mongoose");
const { Schema } = mongoose;

const reportsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "FINANCIAL",
        "SALES",
        "PRODUCTS",
        "CLIENTS",
        "APPOINTMENTS",
        "SERVICES",
        "GENERAL",
      ],
      default: "GENERAL",
    },

    period: {
      startDate: Date,
      endDate: Date,
      label: String,
    },

    summary: {
      totalRevenue: { type: Number, default: 0 },
      totalExpenses: { type: Number, default: 0 },
      totalProfit: { type: Number, default: 0 },
      totalSales: { type: Number, default: 0 },
      totalProductsSold: { type: Number, default: 0 },

      totalClients: { type: Number, default: 0 },
      newClients: { type: Number, default: 0 },
      returningClients: { type: Number, default: 0 },

      totalAppointments: { type: Number, default: 0 },
      completedAppointments: { type: Number, default: 0 },
      cancelledAppointments: { type: Number, default: 0 },
      pendingAppointments: { type: Number, default: 0 },
    },

    financialData: {
      type: [Schema.Types.Mixed],
      default: [],
    },

    salesData: {
      type: [Schema.Types.Mixed],
      default: [],
    },

    productsData: {
      type: [Schema.Types.Mixed],
      default: [],
    },

    clientsData: {
      type: [Schema.Types.Mixed],
      default: [],
    },

    appointmentsData: {
      type: [Schema.Types.Mixed],
      default: [],
    },

    servicesData: {
      type: [Schema.Types.Mixed],
      default: [],
    },

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

reportsSchema.index({
  company: 1,
  type: 1,
  createdAt: -1,
});

delete mongoose.connection.models.Report;
delete mongoose.connection.models.Reports;

const Reports = mongoose.model("Report", reportsSchema, "reports");

module.exports = Reports;
