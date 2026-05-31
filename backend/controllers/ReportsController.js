const Report = require("../models/reports");

const Financial = require("../models/Financial");
const Sale = require("../models/Sales");
const Product = require("../models/Product");
const Client = require("../models/Client");
const Appointment = require("../models/Appointment");
const Service = require("../models/Service");

const getCompanyId = (reqUser) => {
  return reqUser.company?._id || reqUser.company;
};

const getPeriod = (period = "LAST_30_DAYS", startDate, endDate) => {
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate ? new Date(startDate) : new Date();

  if (!startDate) {
    if (period === "LAST_7_DAYS") {
      start.setDate(end.getDate() - 7);
    } else if (period === "CURRENT_MONTH") {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    } else {
      start.setDate(end.getDate() - 30);
    }
  }

  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const getReports = async (req, res) => {
  try {
    const companyId = getCompanyId(req.user);

    const reports = await Report.find({ company: companyId })
      .sort({ createdAt: -1 })
      .populate("generatedBy", "name email");

    res.status(200).json(reports);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao buscar relatórios."],
    });
  }
};

const getReportById = async (req, res) => {
  const { id } = req.params;

  try {
    const companyId = getCompanyId(req.user);

    const report = await Report.findOne({
      _id: id,
      company: companyId,
    }).populate("generatedBy", "name email");

    if (!report) {
      return res.status(404).json({
        errors: ["Relatório não encontrado."],
      });
    }

    res.status(200).json(report);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao buscar relatório."],
    });
  }
};

const generateReport = async (req, res) => {
  const {
    type = "GENERAL",
    period = "LAST_30_DAYS",
    startDate,
    endDate,
  } = req.body;

  try {
    const reqUser = req.user;
    const companyId = getCompanyId(reqUser);
    const { start, end } = getPeriod(period, startDate, endDate);

    const financials = await Financial.find({
      company: companyId,
      createdAt: { $gte: start, $lte: end },
    });

    const sales = await Sale.find({
      company: companyId,
      createdAt: { $gte: start, $lte: end },
    });

    const products = await Product.find({
      company: companyId,
    });

    const clients = await Client.find({
      company: companyId,
    });

    const newClients = clients.filter((client) => {
      const createdAt = new Date(client.createdAt);
      return createdAt >= start && createdAt <= end;
    });

    const appointments = await Appointment.find({
      company: companyId,
      date: { $gte: start, $lte: end },
    }).populate("client", "name cpfCnpj phones email");

    const services = await Service.find({
      company: companyId,
    });

    const totalRevenue = financials
      .filter((item) => item.type === "INCOME" || item.type === "RECEITA")
      .reduce((acc, item) => acc + Number(item.amount || item.value || 0), 0);

    const totalExpenses = financials
      .filter((item) => item.type === "EXPENSE" || item.type === "DESPESA")
      .reduce((acc, item) => acc + Number(item.amount || item.value || 0), 0);

    const totalSales = sales.length;

    const totalProductsSold = sales.reduce((acc, sale) => {
      if (Array.isArray(sale.products)) {
        return (
          acc +
          sale.products.reduce(
            (sum, product) => sum + Number(product.quantity || 0),
            0,
          )
        );
      }

      return acc + Number(sale.quantity || 0);
    }, 0);

    const financialData = financials.map((item) => ({
      title: item.title || item.name || "-",
      type: item.type || "-",
      category: item.category || "-",
      amount: Number(item.amount || item.value || 0),
      paymentMethod: item.paymentMethod || item.payment?.method || "-",
      paymentStatus: item.paymentStatus || item.payment?.status || "-",
      date: item.date || item.createdAt,
    }));

    const salesData = sales.map((sale) => ({
      saleId: sale._id,
      clientName: sale.clientName || sale.client?.name || "-",
      productName: sale.productName || "-",
      quantity: sale.quantity || 0,
      total: Number(sale.total || sale.totalPrice || 0),
      paymentMethod: sale.paymentMethod || sale.payment?.method || "-",
      paymentStatus: sale.paymentStatus || sale.payment?.status || "-",
      date: sale.date || sale.createdAt,
    }));

    const productsData = products.map((product) => ({
      productId: product._id,
      name: product.name,
      quantitySold: 0,
      revenue: 0,
      currentStock: product.stock || 0,
    }));

    const clientsData = clients.map((client) => {
      const clientAppointments = appointments.filter((appointment) => {
        const appointmentClientId =
          typeof appointment.client === "object"
            ? appointment.client?._id?.toString()
            : appointment.client?.toString();

        return appointmentClientId === client._id.toString();
      });

      return {
        clientId: client._id,
        name: client.name,
        cpfCnpj: client.cpfCnpj,
        phone: client.phones?.primary || "",
        email: client.email || "",
        totalPurchases: 0,
        totalSpent: 0,
        lastPurchaseDate: null,
        lastAppointmentDate: clientAppointments[0]?.date || null,
        activeAppointments: clientAppointments.filter(
          (item) => item.status !== "FINISHED" && item.status !== "CANCELLED",
        ).length,
        completedAppointments: clientAppointments.filter(
          (item) => item.status === "FINISHED",
        ).length,
        cancelledAppointments: clientAppointments.filter(
          (item) => item.status === "CANCELLED",
        ).length,
      };
    });

    const appointmentsData = appointments.map((appointment) => ({
      appointmentId: appointment._id,
      title: appointment.title,
      clientName: appointment.client?.name || "-",
      serviceName: appointment.title || "-",
      status: appointment.status,
      paymentStatus: appointment.payment?.status || "-",
      total: Number(appointment.total || 0),
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
    }));

    const report = await Report.create({
      title: `Relatório ${type}`,
      type,
      period: {
        startDate: start,
        endDate: end,
        label: period,
      },
      summary: {
        totalRevenue,
        totalExpenses,
        totalProfit: totalRevenue - totalExpenses,
        totalSales,
        totalProductsSold,
        totalClients: clients.length,
        newClients: newClients.length,
        returningClients: Math.max(clients.length - newClients.length, 0),
        totalAppointments: appointments.length,
        completedAppointments: appointments.filter(
          (item) => item.status === "FINISHED",
        ).length,
        cancelledAppointments: appointments.filter(
          (item) => item.status === "CANCELLED",
        ).length,
        pendingAppointments: appointments.filter(
          (item) => item.status === "PENDING" || item.status === "CONFIRMED",
        ).length,
      },
      financialData,
      salesData,
      productsData,
      clientsData,
      appointmentsData,
      generatedBy: reqUser._id,
      company: companyId,
      cnpj: reqUser.company?.cnpj,
    });

    res.status(201).json(report);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao gerar relatório."],
    });
  }
};

const deleteReport = async (req, res) => {
  const { id } = req.params;

  try {
    const companyId = getCompanyId(req.user);

    const report = await Report.findOne({
      _id: id,
      company: companyId,
    });

    if (!report) {
      return res.status(404).json({
        errors: ["Relatório não encontrado."],
      });
    }

    await Report.findByIdAndDelete(report._id);

    res.status(200).json({
      message: "Relatório removido com sucesso.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao remover relatório."],
    });
  }
};

module.exports = {
  getReports,
  getReportById,
  generateReport,
  deleteReport,
};
