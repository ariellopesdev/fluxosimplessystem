const mongoose = require("mongoose");
const { Schema } = mongoose;

const dashboardSchema = new Schema(
  {
    title: {
      type: String,
      default: "Dashboard principal",
    },

    period: {
      startDate: Date,
      endDate: Date,
      label: {
        type: String,
        enum: ["TODAY", "LAST_7_DAYS", "LAST_30_DAYS", "CURRENT_MONTH"],
        default: "CURRENT_MONTH",
      },
    },

    summary: {
      totalRevenue: { type: Number, default: 0 },
      totalExpenses: { type: Number, default: 0 },
      totalProfit: { type: Number, default: 0 },
      totalAssets: { type: Number, default: 0 },

      totalSales: { type: Number, default: 0 },
      totalProductsSold: { type: Number, default: 0 },

      totalClients: { type: Number, default: 0 },
      newClients: { type: Number, default: 0 },

      totalAppointments: { type: Number, default: 0 },
      pendingAppointments: { type: Number, default: 0 },
      completedAppointments: { type: Number, default: 0 },
      cancelledAppointments: { type: Number, default: 0 },

      totalServices: { type: Number, default: 0 },
      activeServices: { type: Number, default: 0 },

      lowStockProducts: { type: Number, default: 0 },
    },

    charts: {
      financialEvolution: {
        type: [Schema.Types.Mixed],
        default: [],
      },

      salesEvolution: {
        type: [Schema.Types.Mixed],
        default: [],
      },

      appointmentStatus: {
        type: [Schema.Types.Mixed],
        default: [],
      },

      topProducts: {
        type: [Schema.Types.Mixed],
        default: [],
      },

      topClients: {
        type: [Schema.Types.Mixed],
        default: [],
      },
    },

    alerts: [
      {
        type: {
          type: String,
          enum: ["INFO", "WARNING", "DANGER", "SUCCESS"],
          default: "INFO",
        },
        title: String,
        message: String,
        module: {
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
        referenceId: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],

    recentActivities: [
      {
        module: {
          type: String,
          enum: [
            "FINANCIAL",
            "SALES",
            "PRODUCTS",
            "CLIENTS",
            "APPOINTMENTS",
            "SERVICES",
            "REPORTS",
            "GENERAL",
          ],
          default: "GENERAL",
        },
        action: String,
        description: String,
        date: Date,
        referenceId: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    cnpj: String,
  },
  {
    timestamps: true,
  },
);

dashboardSchema.index({
  company: 1,
  "period.label": 1,
  createdAt: -1,
});

const Dashboard = mongoose.model("Dashboard", dashboardSchema);

module.exports = Dashboard;