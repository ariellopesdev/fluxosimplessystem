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

    financialData: [
      {
        title: String,
        type: String,
        category: String,
        amount: Number,
        paymentMethod: String,
        paymentStatus: String,
        date: Date,
      },
    ],

    salesData: [
      {
        saleId: String,
        clientName: String,
        productName: String,
        quantity: Number,
        total: Number,
        paymentMethod: String,
        paymentStatus: String,
        date: Date,
      },
    ],

    productsData: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        quantitySold: { type: Number, default: 0 },
        revenue: { type: Number, default: 0 },
        currentStock: { type: Number, default: 0 },
      },
    ],

    clientsData: [
      {
        clientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Client",
        },
        name: String,
        cpfCnpj: String,
        phone: String,
        email: String,
        totalPurchases: { type: Number, default: 0 },
        totalSpent: { type: Number, default: 0 },
        lastPurchaseDate: Date,
        lastAppointmentDate: Date,
        activeAppointments: { type: Number, default: 0 },
        completedAppointments: { type: Number, default: 0 },
        cancelledAppointments: { type: Number, default: 0 },
      },
    ],

    appointmentsData: [
      {
        appointmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Appointment",
        },
        title: String,
        clientName: String,
        serviceName: String,
        status: String,
        paymentStatus: String,
        total: Number,
        date: Date,
        startTime: String,
        endTime: String,
      },
    ],

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

const Reports = mongoose.model("Reports", reportsSchema);

module.exports = Reports;